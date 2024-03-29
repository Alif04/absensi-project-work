const { PrismaClient } = require('@prisma/client');
const cron = require('node-cron');

const dbService = new PrismaClient();

class NotAttendanceController {
  async createNotAttendance() {
    try {
      const student = await dbService.students.findMany({
        where: {
          status: {
            status: {
              contains: 'alpa',
            },
          },
        },
      });

      const employee = await dbService.employee.findMany({
        where: {
          status: {
            status: {
              contains: 'alpa',
            },
          },
        },
      });

      let dataToCreate = [];

      if (Math.random() < 0.5 && student.length > 0) {
        dataToCreate = student.map((s) => ({ students_id: s.id }));
      } else if (employee.length > 0) {
        dataToCreate = employee.map((e) => ({ employee_id: e.id }));
      }

      const [notAttendances] = await dbService.$transaction([
        dbService.not_attendances.createMany({
          data: dataToCreate,
        }),
      ]);
      return console.log({
        data: notAttendances,
        message: 'Successfully Create',
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateStudentsEmployee() {
    try {
      const status = await dbService.status.findFirst({
        where: {
          status: {
            contains: 'alpa',
          },
        },
      });
      const [students, employee] = await dbService.$transaction([
        dbService.students.updateMany({
          where: {
            status: {
              status: {
                contains: 'hadir',
              },
            },
          },
          data: {
            status_id: status.id,
          },
        }),
        dbService.employee.updateMany({
          where: {
            status: {
              status: {
                contains: 'hadir',
              },
            },
          },
          data: {
            status_id: status.id,
          },
        }),
      ]);

      return console.log({
        data: { students, employee },
        message: 'Success Update',
      });
    } catch (error) {
      console.log(error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { description, status } = req.body;
      const getAttendances = await dbService.not_attendances.findFirst({
        where: {
          id,
        },
        include: {
          employee: true,
          students: true,
        },
      });
      const getStatus = await dbService.status.findFirst({
        where: {
          status: {
            contains: status,
          },
        },
      });
      if (getAttendances.students.id != null) {
        await dbService.students.update({
          where: {
            id: getAttendances.students.id,
          },
          data: {
            status: {
              connect: {
                id: getStatus.id,
              },
            },
          },
        });
      } else if (getAttendances.employee.id != null) {
        await dbService.employee.update({
          where: {
            id: getAttendances.students.id,
          },
          data: {
            status: {
              connect: {
                id: getStatus.id,
              },
            },
          },
        });
      }
      const not_attendance = await dbService.not_attendances.update({
        where: {
          id,
        },
        data: {
          description: description,
          updated_at: new Date(),
        },
      });

      return res.status(200).json({
        status: 200,
        message: 'Update Success',
        data: not_attendance,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message ?? 'Error While Update',
        stack: error,
      });
    }
  }
}

cron.schedule('0 13 * * *', function () {
  const notAttendanceController = new NotAttendanceController();
  notAttendanceController.createNotAttendance();
});

cron.schedule('45 13 * * *', function () {
  const notAttendanceController = new NotAttendanceController();
  notAttendanceController.updateStudentsEmployee();
});

module.exports = NotAttendanceController;
