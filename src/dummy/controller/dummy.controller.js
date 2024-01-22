const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

class DummyController {
  async createStudent(req, res) {
    try {
      const { name, nis, whatsapp_number, rayon_id, rombel_id } = req.body;

      const status = await prisma.status.findFirst({
        where: {
          status: {
            contains: 'ALPA',
          },
        },
      });

      if (!status) throw new Error('Status not found');

      const rayon = await prisma.rayons.findFirst({
        where: {
          id: rayon_id,
        },
      });
      if (!rayon) throw new Error('Rayon not found');
      const rombel = await prisma.rombels.findFirst({
        where: {
          id: rombel_id,
        },
      });
      if (!rombel) throw new Error('Rombel not found');

      const students = await prisma.students.create({
        data: {
          name: name,
          nis: nis,
          whatsapp_number: whatsapp_number,
          rayon: {
            connect: {
              id: rayon.id,
            },
          },
          rombel: {
            connect: {
              id: rombel.id,
            },
          },
          status: {
            connect: {
              id: status.id,
            },
          },
        },
      });

      return res.status(201).json({
        status: 201,
        message: 'Success',
        data: students,
      });
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        status: 400,
        message: error.message,
        stack: error,
      });
    }
  }

  async createEmployee(req, res) {
    try {
      const { name, nip, whatsapp_number, role_id, rayon_id } = req.body;

      const status = await prisma.status.findFirst({
        where: {
          status: {
            contains: 'ALPA',
          },
        },
      });
      if (!status) throw new Error('Status not found');

      let rayon;
      const role = await prisma.roles.findFirst({
        where: {
          id: role_id,
        },
      });
      if (!role) throw new Error('Role not found');

      if (role.name === 'PEMBIMBING SISWA') {
        rayon = await prisma.rayons.findFirst({
          where: {
            id: rayon_id ?? 0,
          },
        });
        if (!rayon) throw new Error('Rayon not found');
      }

      const employee = {
        name,
        nip,
        whatsapp_number,
        roles: {
          connect: {
            id: role.id,
          },
        },
        status: {
          connect: {
            id: status.id,
          },
        },
      };

      const user = {
        username: name,
        password: await hash(nip, 12),
        roles: {
          connect: {
            id: role.id,
          },
        },
      };

      const employees = await prisma.employee.create({
        data: employee,
      });

      const users = await prisma.users.create({
        data: {
          ...user,
          user_employee: {
            create: {
              employee_id: employees.id,
            },
          },
          ...(rayon.id
            ? {
                user_rayon: {
                  create: {
                    rayon_id: rayon.id,
                  },
                },
              }
            : undefined),
        },
      });
      return res.status(201).json({
        status: 201,
        message: 'Success',
        data: employees,
        user: users,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        stack: error,
      });
    }
  }

  async getStatus(req, res) {
    try {
      const status = await prisma.status.findMany();

      return res.status(200).json({
        message: 'Success',
        data: status,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'Failed',
        stack: error,
      });
    }
  }

  async getRayon(req, res) {
    try {
      const rayon = await prisma.rayons.findMany();

      return res.status(200).json({
        message: 'Success',
        data: rayon,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'Failed',
        stack: error,
      });
    }
  }

  async getRombel(req, res) {
    try {
      const rombel = await prisma.rombels.findMany({
        include: {
          major: true,
        },
      });

      return res.status(200).json({
        message: 'Success',
        data: rombel,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'Failed',
        stack: error,
      });
    }
  }

  async getRole(req, res) {
    try {
      const role = await prisma.roles.findMany();

      return res.status(200).json({
        message: 'Success',
        data: role,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: 'Failed',
        stack: error,
      });
    }
  }
}

module.exports = DummyController;
