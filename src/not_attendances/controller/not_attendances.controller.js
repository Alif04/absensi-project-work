const { PrismaClient } = require("@prisma/client");
const cron = require("node-cron");

const prisma = new PrismaClient();

class NotAttendanceController {
  async createNotAttendance() {
    try {
      const student = await prisma.students.findMany({
        where: {
          status: false,
        },
      });

      const employee = await prisma.employee.findMany({
        where: {
          status: false,
        },
      });

      let dataToCreate = [];

      if (Math.random() < 0.5 && student.length > 0) {
        dataToCreate = student.map((s) => ({ students_id: s.id }));
      } else if (employee.length > 0) {
        dataToCreate = employee.map((e) => ({ employee_id: e.id }));
      }

      await prisma.not_attendances.createMany({
        data: dataToCreate,
      });
      return console.log("Success Create Not Attendances");
    } catch (error) {
      console.log(error);
    }
  }

  async updateStudentsEmployee() {
    try {
      await prisma.students.updateMany({
        where: {
          status: false,
        },
        data: {
          status: true,
        },
      });
      await prisma.employee.updateMany({
        where: {
          status: false,
        },
        data: {
          status: true,
        },
      });

      console.log("Success Update Status");
    } catch (error) {
      console.log(error);
    }
  }

  async getStudents(req, res) {
    try {
      const { search } = req.query;
      const students = await prisma.students.findMany({
        where: {
          AND: [
            {
              status: false,
            },
            search
              ? {
                  OR: [
                    {
                      name: {
                        contains: search,
                      },
                    },
                    {
                      nis: {
                        contains: search,
                      },
                    },
                    {
                      rayon: {
                        name: {
                          contains: search,
                        },
                      },
                    },
                    {
                      OR: [
                        {
                          rombel: {
                            rombel: {
                              equals: search,
                            },
                          },
                        },
                        {
                          rombel: {
                            major: {
                              name: {
                                contains: search
                              }
                            }
                          }
                        },
                      ],
                    },
                  ],
                }
              : {},
          ],
        },
        include: {
          not_attendance: true,
          rayon: true,
          rombel: {
            include: {
              major: true,
            },
          },
        },
      });
      

      return res.status(200).json({
        status: 200,
        message: "Get Data",
        data: students,
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

  async getStudentsByRayon(req, res) {
    try {
      const { search, date_to, date_from } = req.query;
      const token = req.header("Authorization")?.replace("Bearer ", "");
      const token_decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await prisma.users.findFirst({
        where: {
          id: token_decoded.user_id,
          user_rayon: {
            every: {
              rayon_id: token_decoded.rayon_id
            }
          }
        },
        include:{
          user_rayon: {
            include: {
              rayon: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      });
      const rayon = user.user_rayon[0].rayon.name
      const students = await prisma.students.findMany({
        where: {
          AND: [
            {
              status: false,
              rayon: {
                name: rayon
              }
            },
            search
              ? {
                  OR: [
                    {
                      name: {
                        contains: search,
                      },
                    },
                    {
                      nis: {
                        contains: search,
                      },
                    },
                    {
                      rayon: {
                        name: {
                          contains: search,
                        },
                      },
                    },
                    {
                      OR: [
                        {
                          rombel: {
                            rombel: {
                              equals: search,
                            },
                          },
                        },
                        {
                          rombel: {
                            major: {
                              name: {
                                contains: search
                              }
                            }
                          }
                        },
                      ],
                    },
                  ],
                }
              : {},
              date_from && date_to
              ? {
                  created_at: {
                    gte: new Date(`${date_from}T00:00:00.000Z`),
                    lte: new Date(`${date_to}T23:59:59.000Z`),
                  },
                }
              : {},
          ],
        },
        include: {
          not_attendance: true,
          rayon: true,
          rombel: {
            include: {
              major: true,
            },
          },
        },
      });
      

      return res.status(200).json({
        status: 200,
        message: "Get Data",
        data: students,
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
      const { search } = req.query;

      const employee = await prisma.employee.findMany({
        where: {
          AND: [
            search
              ? {
                  OR: [
                    {
                      name: {
                        contains: search,
                      },
                    },
                    {
                      nip: {
                        contains: search,
                      },
                    },
                    {
                      rayon: {
                        name: {
                          contains: search,
                        },
                      },
                    },
                    {
                      roles: {
                        name: {
                          contains: search,
                        },
                      },
                    },
                  ],
                }
              : {},
              date_from && date_to
              ? {
                  created_at: {
                    gte: new Date(`${date_from}T00:00:00.000Z`),
                    lte: new Date(`${date_to}T23:59:59.000Z`),
                  },
                }
              : {},
            {
              status: false,
            },
          ],
        },
        include: {
          not_attendance: true,
          rayon: true,
          roles: true,
        },
      });

      return res.status(200).json({
        status: 200,
        message: "Get Data",
        data: employee,
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
    if (!req.files || !req.files["image"]) throw new Error("File is required");
    try {
      const { id } = req.params;
      const { description } = req.body;
      const image = req.files["images"][0].filename;
      const not_attendance = await prisma.not_attendances.update({
        where: {
          id,
        },
        data: {
          description: description,
          evidence_location: image ? image : null,
          updated_at: new Date()
        },
      });

      return res.status(200).json({
        status: 200,
        message: "Update Success",
        data: not_attendance,
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message ?? "Error While Update",
        stack: error,
      });
    }
  }
}

cron.schedule("0 13 * * *", function () {
  const notAttendanceController = new NotAttendanceController();
  notAttendanceController.createNotAttendance();
});

cron.schedule("45 10 * * *", function () {
  const notAttendanceController = new NotAttendanceController();
  notAttendanceController.updateStudentsEmployee();
});

module.exports = NotAttendanceController;
