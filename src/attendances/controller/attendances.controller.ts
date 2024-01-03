import { Prisma, PrismaClient } from "@prisma/client";
import { userInfo } from "os";
import exceljs from 'exceljs'
import moment from 'moment'
const { insideCircle } = require("geolocation-utils");
const jwt = require("jsonwebtoken");
const dbService = new PrismaClient();

export default class AttendanceController {
  constructor() {
    this.importExcel = this.importExcel.bind(this);
  }

  async importExcel(req, res) {
    try {
      const { search, take = 10, page = 1, status, date_from, date_to } = req.query;
      const student = await this.getStudent(req, res);
      console.log();


      const excel = new exceljs.Workbook();
      const newExcel = excel.addWorksheet('Attendance Sheet');
      newExcel.addRow([
        "Name",
        "Nis",
        "Status",
        "Jam Kehadiran"
      ]);

      student.data.forEach((item) => {
        newExcel.addRow([
          item.name,
          item.nis,
          item.status.status,
          item.attendance[0]?.time ?? 'tidak ada absen'
        ]);
      });

      // Mengirim file Excel sebagai respons HTTP
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=attendance.xlsx');
      const buffer = await excel.xlsx.writeBuffer();
      return res.send(buffer);

    } catch (error) {
      console.log(error);
      return "ERROR";
    }
  }

  async create(req, res) {
    const { nip, nis, lat, lon } = req.body;
    if (!req.files || !req.files["image"])
      return res.status(400).json({ message: "File is required" });
    try {
      const image = req.files["image"][0].filename;
      let data;
      let dataUpdate;
      const radius = 100;
      const lat1 = -6.6449872;
      const lon1 = 106.8429252;
      const location1 = { lat: Number(lat), lon: Number(lon) };
      const location2 = { lat: lat1, lon: lon1 };
      const circle = insideCircle(location2, location1, radius);
      const now = new Date();
      if (!circle) throw new Error("Location Invalid");
      const status = await dbService.status.findFirst({
        where: {
          status: {
            contains: "hadir",
          },
        },
      });
      if (nis) {
        const students = await dbService.students.findFirst({
          where: {
            nis: nis,
          },
        });
        data = {
          students: {
            connect: {
              id: students?.id,
            },
          },
          time: moment(now).format("DD-MM-YYYY-HH:mm:ss"),
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

      const [student, employee, attendance] = await dbService.$transaction([
        dbService.students.update(dataUpdate),
        dbService.employee.update(dataUpdate),
        dbService.attendances.create({
          data,
        }),
      ]);

      // TODO: SEND WHATSAPP MESSAGE AFTER ATTENDANCES

      return res.status(201).json({
        status: 201,
        message: "Attendances created",
        data: attendance,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: error.message ?? "Error While Create",
        stack: error,
      });
    }
  }

  //TODO: EXPORT EXCEL AFTER GETSTUDENT
  async getStudent(req, res) {
    try {
      const { search, date_to, take = 10, page = 1, date_from, status, rayon } = req.query;
      const skip = +page * +take - +take;
      const userRayon = await dbService.rayons.findFirst({
        where: {
          id: req.user.user_rayon.rayon_id ?? 0
        }
      })
      // console.log("USER RAYON", userRayon);

      const where: Prisma.studentsWhereInput = {
        AND: [
          search
            ? {
              OR: [
                { name: { contains: search } },
                { nis: { contains: search } },
                // { rayon: { name: { contains: rayon } } },
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
          status === 'tidakhadir'
            ? {
              status: {
                status: {
                  in: ['alpa', 'sakit', 'izin']
                }
              }
            }
            : {
              status: {
                status: {
                  contains: status
                },
              },
            },
          rayon
            ? {
              rayon: {
                name: {
                  contains: rayon
                }
              }
            } : undefined,
          userRayon?.id
            ? {
              rayon_id: userRayon.id,
            }
            : undefined,
        ].filter(Boolean),
      };

      const students = await dbService.students.findMany({
        where,
        orderBy: {
          created_at: 'desc'
        },
        take: +take <= 0 ? undefined : +take,
        skip,
        include: {
          attendance: {
            orderBy: {
              created_at: 'desc'
            }
          },
          rayon: true,
          status: true,
          rombel: {
            include: {
              major: true,
            },
          },
        },
      });

      console.log(students);


      return res.json({
        status: 200,
        message: "Get Attendances",
        data: students,
        skip,
        page,
        take: Math.max(+take, 0)  // Perubahan di sini
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: "Error While Get",
        stack: error,
      });
    }
  }

  async getEmployee(req, res) {
    try {
      const { search, take = 10, page = 1, status, date_from, date_to } = req.query;
      const skip = +page * +take - +take;
      console.log("SKIPPPPS", take, page, skip);

      const where: Prisma.employeeWhereInput = {
        AND: [
          search
            ? {
              OR: [
                { name: { contains: search } },
                { nip: { contains: search } },
                // { rayon: { name: { contains: rayon } } },
                { roles: { name: { contains: search } } }
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
          status
            ? {
              status: {
                status: {
                  contains: status
                },
              },
            }
            : undefined,
        ].filter(Boolean),
      };

      const employee = await dbService.employee.findMany({
        where,
        orderBy: {
          created_at: 'desc'
        },
        take: +take <= 0 ? undefined : +take,
        skip,
        include: {
          attendances: true,
          roles: true,
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
        message: "Get Attendances",
        data: employee,
        skip,
        page,
        take
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: 400,
        message: "Error While Get",
        stack: error,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params.id;
      const { student_id, employee_id } = req.body;
      if (!req.files || !req.files["image"])
        throw new Error("Image is required");
      const image = req.files["image"][0].filename;
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
        message: "Attendances updated",
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: "Error While Update",
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
        message: "Attendance Deleted",
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: "Error While Update",
        stack: error,
      });
    }
  }
}
