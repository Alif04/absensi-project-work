const { Prisma, PrismaClient } = require('@prisma/client');
const { userInfo } = require('os');
const exceljs = require('exceljs');
const moment = require('moment');
const { insideCircle } = require('geolocation-utils');
const dbService = new PrismaClient();
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class AttendanceController {
  constructor() {
    this.importExcel = this.importExcel.bind(this);
    this.create = this.create.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.isClientInitialized = false;
    this.client = null;
  }
  async initializeClient() {
    try {
      this.client = new Client({
        webVersionCache: {
          type: 'remote',
          remotePath:
            'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        },
      });

      this.client.on('qr', (qrCode) => {
        if (!this.isClientInitialized) {
          console.log('Scan the QR code with your phone:');
          qrcode.generate(qrCode, { small: true });
        }
      });

      // this.client.on('ready', () => {
      //   console.log('Client is ready!');
      //   this.saveSession();
      // });

      this.client.on('message', (message) => {
        console.log(`Received message from ${message.from}: ${message.body}`);
      });

      // await this.loadSession();

      await this.client.initialize();
      this.isClientInitialized = true;
    } catch (error) {
      console.error('Error initializing WhatsApp client:', error.message);
    }
  }

  async sendMessage(phoneNumber, message) {
    if (!this.isClientInitialized) {
      await this.initializeClient();
    }

    try {
      await this.client.sendMessage(`${phoneNumber}@c.us`, message);
      console.log(`Message successfully sent to ${phoneNumber}`);
    } catch (error) {
      console.error(`Error sending WhatsApp message: ${error.message}`);
    }
  }

  async importExcel(req, res) {
    try {
      const {
        search,
        take = 10,
        page = 1,
        status,
        date_from,
        date_to,
      } = req.query;
      const student = await this.getStudent(req, res);
      console.log(student.data);

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Attendance Sheet');

      // Header row
      const headerRow = worksheet.addRow([
        'Name',
        'Nis',
        'Status',
        'Jam Kehadiran',
      ]);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'dddddd' }, // Warna latar belakang header
        };
        cell.font = {
          bold: true,
        };
      });

      // Data rows
      student.data.forEach((item) => {
        const row = worksheet.addRow([
          item.name,
          item.nis,
          item.status.status,
          item.attendance[0]?.time || 'tidak ada absen',
        ]);

        // Tambahkan pemformatan tambahan jika diperlukan
      });

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=attendance.xlsx',
      );

      // Write to buffer and send response
      const buffer = await workbook.xlsx.writeBuffer();
      return res.send(buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  }

  async create(req, res) {
    const { nip, nis, lat, lon } = req.body;
    if (!req.file) return res.status(400).json({ message: 'File is required' });
    try {
      console.log(req.file);
      const image = req.file.originalname;
      let data;
      let dataUpdate;
      const radius = 100;
      const lat1 = -6.6454088;
      const lon1 = 106.8432584;
      const location1 = { lat: Number(lat), lon: Number(lon) };
      const location2 = { lat: Number(lat), lon: Number(lon) };
      const circle = insideCircle(location2, location1, radius);
      console.log('circle', circle);
      console.log('location1', location1);
      const now = new Date();
      if (!circle) throw new Error('Location Invalid');
      let whatsapp_number;
      let attendance_name;
      const status = await dbService.status.findFirst({
        where: {
          status: {
            contains: 'HADIR',
          },
        },
      });
      if (nis) {
        const students = await dbService.students.findFirst({
          where: {
            nis: nis,
          },
        });

        console.log(nis);
        console.log(status.id);

        whatsapp_number = students.whatsapp_number;
        attendance_name = students.name;
        data = {
          students: {
            connect: {
              id: students.id,
            },
          },
          latitude: lat,
          longitude: lon,
          time: new Date(Date.now()),
          evidence_location: image,
        };

        dataUpdate = {
          where: {
            id: students?.id,
          },
          data: {
            status: {
              connect: {
                id: status.id,
              },
            },
          },
        };
      } else if (nip) {
        const employee = await dbService.employee.findFirst({
          where: {
            nip: nip,
          },
        });

        whatsapp_number = employee.whatsapp_number;
        attendance_name = employee.name;

        data = {
          employee: {
            connect: {
              id: employee?.id,
            },
          },
          evidence_location: image,
          time: new Date(),
        };

        dataUpdate = {
          where: {
            id: employee?.id,
          },
          data: {
            status: {
              connect: {
                id: status.id,
              },
            },
          },
        };
      }

      const [attendance, student = null, employee = null] =
        await dbService.$transaction([
          dbService.attendances.create({ data }),
          ...(nis ? [dbService.students.update(dataUpdate)] : []),
          ...(nip ? [dbService.employee.update(dataUpdate)] : []),
        ]);

      const message = `Halo Bapak/Ibu, ${attendance_name} hadir ke sekolah pada pukul ${attendance.time} dan hadir tepat waktu`;
      const formattedNumber = whatsapp_number.replace(/^\+/, '');
      // return 'success';
      // await this.sendMessage(formattedNumber, message);

      return res.status(201).json({
        status: 201,
        message: 'Attendances created',
        data: attendance,
      });
    } catch (error) {
      console.log('error', error);
      return res.status(400).json({
        status: 400,
        message: error.message ?? 'Error While Create',
        stack: error,
      });
    }
  }

  async getStudent(req, res) {
    try {
      const {
        search,
        date_to,
        take = 10,
        page = 1,
        date_from,
        status,
        rayon,
      } = req.query;
      const skip = +page * +take - +take;
      const userRayon = await dbService.rayons.findFirst({
        where: {
          id: req.user?.user_rayon[0]?.rayon_id ?? 0,
        },
      });

      const student = await dbService.students.findMany({
        where: {
          status: {
            status: {
              contains: 'HADIR',
            },
          },
          rayon_id: 1,
        },
      });
      const where = {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  { nis: { contains: search } },
                  { rayon: { name: { contains: search } } },
                  {
                    OR: [
                      { rombel: { rombel: { contains: search } } },
                      { rombel: { major: { name: { contains: search } } } },
                    ],
                  },
                ],
              }
            : undefined,
          date_from && date_to
            ? {
                created_at: {
                  gte: new Date(`${date_from}T00:00:00.000Z`),
                  lte: new Date(`${date_to}T23:59:59.000Z`),
                },
              }
            : undefined,
          status === 'TIDAK_HADIR'
            ? {
                status: {
                  status: {
                    in: ['ALPA', 'SAKIT', 'IZIN'],
                  },
                },
              }
            : {
                status: {
                  status: {
                    contains: status,
                  },
                },
              },
          userRayon?.id
            ? {
                rayon_id: userRayon.id,
              }
            : undefined,
        ].filter(Boolean),
      };
      console.log('====================================');
      console.log('WHERE', where.status);
      console.log('====================================');

      const students = await dbService.students.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        take: +take <= 0 ? undefined : +take,
        skip,
        include: {
          attendance: true,
          rayon: true,
          status: true,
          rombel: {
            include: {
              major: true,
            },
          },
        },
      });

      console.log('STUDENTS', students);

      return res.status(200).json({
        status: 200,
        message: 'Get Attendances',
        data: students,
        skip,
        page,
        take,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: 'Error While Get',
        stack: error,
      });
    }
  }

  async getEmployee(req, res) {
    try {
      const {
        search,
        take = 10,
        page = 1,
        status,
        date_from,
        date_to,
      } = req.query;
      const skip = +page * +take - +take;
      console.log('SKIPPPPS', take, page, skip);

      const where = {
        AND: [
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  { nip: { contains: search } },
                  // { rayon: { name: { contains: rayon } } },
                  { roles: { name: { contains: search } } },
                ],
              }
            : undefined,
          date_from && date_to
            ? {
                created_at: {
                  gte: new Date(`${date_from}T00:00:00.000Z`),
                  lte: new Date(`${date_to}T23:59:59.000Z`),
                },
              }
            : undefined,
          status === 'TIDAK_HADIR'
            ? {
                status: {
                  status: {
                    in: ['ALPA', 'SAKIT', 'IZIN'],
                  },
                },
              }
            : {
                status: {
                  status: {
                    contains: status,
                  },
                },
              },
        ].filter(Boolean),
      };

      const employee = await dbService.employee.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
        take: +take <= 0 ? undefined : +take,
        skip,
        include: {
          attendances: true,
          roles: true,
          status: true,
          user_employee: {
            include: {
              users: {
                include: {
                  user_rayon: {
                    include: {
                      rayon: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return res.status(200).json({
        status: 200,
        message: 'Get Attendances',
        data: employee,
        skip,
        page,
        take,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: 'Error While Get',
        stack: error,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params.id;
      const { student_id, employee_id } = req.body;
      if (!req.files || !req.files['image'])
        throw new Error('Image is required');
      const image = req.files['image'][0].filename;
      let data;
      if (student_id) {
        data = {
          students: {
            connect: {
              id: student_id,
            },
          },
          time: new Date(),
          evidence_location: image,
        };
      } else if (employee_id) {
        data = {
          employee: {
            connect: {
              id: employee_id,
            },
          },
          evidence_location: image,
          time: new Date(),
        };
      }

      await dbService.attendances.update({
        where: {
          id,
        },
        data,
        include: {
          employee: employee_id ? true : false,
          students: student_id ? true : false,
        },
      });
      return res.status(200).json({
        status: 200,
        message: 'Attendances updated',
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'Error While Update',
        stack: error,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params.id;
      const { student_id, employee_id } = req.body;
      if (!req.files || !req.files['image'])
        throw new Error('Image is required');
      const image = req.files['image'][0].filename;
      let data;
      if (student_id) {
        data = {
          students: {
            connect: {
              id: student_id,
            },
          },
          time: new Date(),
          evidence_location: image,
        };
      } else if (employee_id) {
        data = {
          employee: {
            connect: {
              id: employee_id,
            },
          },
          evidence_location: image,
          time: new Date(),
        };
      }

      await dbService.attendances.update({
        where: {
          id,
        },
        data,
        include: {
          employee: employee_id ? true : false,
          students: student_id ? true : false,
        },
      });
      return res.status(200).json({
        status: 200,
        message: 'Attendances updated',
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'Error While Update',
        stack: error,
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params.id;
      const attendance = await dbService.attendances.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({
        status: 200,
        message: 'Attendance Deleted',
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'Error While Update',
        stack: error,
      });
    }
  }
}

module.exports = AttendanceController;
