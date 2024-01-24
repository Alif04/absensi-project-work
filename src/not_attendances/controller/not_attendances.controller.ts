import { PrismaClient } from "@prisma/client"
import cron from "node-cron"

const dbService = new PrismaClient()

export default class NotAttendanceController {
  async createNotAttendance() {
    try {
      const student = await dbService.students.findMany({
        where: {
          status: {
            status: {
              contains: "alpa",
            },
          },
        },
      })

      const employee = await dbService.employee.findMany({
        where: {
          status: {
            status: {
              contains: "alpa",
            },
          },
        },
      })

      let dataToCreate = []

      if (Math.random() < 0.5 && student.length > 0) {
        dataToCreate = student.map((s) => ({ students_id: s.id }))
      } else if (employee.length > 0) {
        dataToCreate = employee.map((e) => ({ employee_id: e.id }))
      }

      const [notAttendances] = await dbService.$transaction([
        dbService.not_attendances.createMany({
          data: dataToCreate,
        }),
      ])
      return console.log({
        data: notAttendances,
        message: "Successfully Create",
      })
    } catch (error) {
      console.log(error)
    }
  }

  async updateStudentsEmployee() {
    try {
      const status = await dbService.status.findFirst({
        where: {
          status: {
            contains: "alpa",
          },
        },
      })
      const [students, employee] = await dbService.$transaction([
        dbService.students.updateMany({
          where: {
            status: {
              status: {
                contains: "hadir",
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
                contains: "hadir",
              },
            },
          },
          data: {
            status_id: status.id,
          },
        }),
      ])

      return console.log({
        data: { students, employee },
        message: "Success Update",
      })
    } catch (error) {
      console.log(error)
    }
  }

  // async update(req, res) {
  //   try {
  //     const { id } = req.params
  //     const { description, status } = req.body
  //     const getAttendances = await dbService.not_attendances.findFirst({
  //       where: {
  //         id: parseInt(id),
  //       },
  //       include: {
  //         employee: true,
  //         students: true,
  //       },
  //     })
  //     const getStatus = await dbService.status.findFirst({
  //       where: {
  //         status: {
  //           contains: status,
  //         },
  //       },
  //     })
  //     if (getAttendances.students.id != null) {
  //       await dbService.students.update({
  //         where: {
  //           id: getAttendances.students.id,
  //         },
  //         data: {
  //           status: {
  //             connect: {
  //               id: getStatus.id,
  //             },
  //           },
  //         },
  //       })
  //     } else if (getAttendances.employee.id != null) {
  //       await dbService.employee.update({
  //         where: {
  //           id: getAttendances.students.id,
  //         },
  //         data: {
  //           status: {
  //             connect: {
  //               id: getStatus.id,
  //             },
  //           },
  //         },
  //       })
  //     }
  //     const not_attendance = await dbService.not_attendances.update({
  //       where: {
  //         id: parseInt(id),
  //       },
  //       data: {
  //         description: description,
  //         updated_at: new Date(),
  //       },
  //     })

  //     return res.status(200).json({
  //       status: 200,
  //       message: "Update Success",
  //       data: not_attendance,
  //     })
  //   } catch (error) {
  //     return res.status(400).json({
  //       status: 400,
  //       message: error.message ?? "Error While Update",
  //       stack: error,
  //     })
  //   }
  // }

  async updateStudents(req, res) {
    const { id } = req.params
    const { description, status } = req.body
    if (!req.files || !req.files["image"])
      return res.status(400).json({ message: "Image is required" })

    try {
      const image = req.files["image"][0].filename
      const students = await dbService.students.findFirst({
        where: {
          id: parseInt(id),
        },
        include: {
          not_attendance: true,
        },
      })
      const getStatus = await dbService.status.findFirst({
        where: {
          status: {
            contains: status,
          },
        },
      })
      if (!students) throw new Error("Student is not found!")
      if (!status) throw new Error("Status is not found!")

      const studentUpdate = await dbService.students.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status_id: getStatus.id,
          not_attendance: {
            create: {
              evidence_location: image,
              description: description,
            },
          },
        },
      })

      return res.status(200).json({
        status: 200,
        message: "Update Success",
        data: studentUpdate,
      })
    } catch (error) {
      console.log("====================================")
      console.log(error)
      console.log("====================================")
      return res.status(400).json({
        status: 400,
        message: error.message ?? "Error While Update",
        stack: error,
      })
    }
  }

  async updateEmployee(req, res) {
    const { id } = req.params
    const { description, status } = req.body
    if (!req.files || !req.files["image"])
      return res.status(400).json({ message: "Image is required" })

    try {
      const image = req.files["image"][0].filename
      const employees = await dbService.employee.findFirst({
        where: {
          id: parseInt(id),
        },
        include: {
          not_attendance: true,
        },
      })
      const getStatus = await dbService.status.findFirst({
        where: {
          status: {
            contains: status,
          },
        },
      })
      if (!employees) throw new Error("Student is not found!")
      if (!status) throw new Error("Status is not found!")

      const employeeUpdate = await dbService.employee.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status_id: getStatus.id,
          not_attendance: {
            create: {
              evidence_location: image,
              description: description,
            },
          },
        },
      })

      return res.status(200).json({
        status: 200,
        message: "Update Success",
        data: employeeUpdate,
      })
    } catch (error) {
      console.log("====================================")
      console.log(error)
      console.log("====================================")
      return res.status(400).json({
        status: 400,
        message: error.message ?? "Error While Update",
        stack: error,
      })
    }
  }

  async updateStatus(req, res) {
    const { id } = req.params
    const { status_id, description } = req.body
    try {
      // if (!req.files || !req.files["image"] || !req.files["image"][0])
      //   return res.status(400).json({ message: "Image is required" })
      // console.log("req.files:", req.files)
      // const image = req.files["image"][0].filename
      let status: number

      switch (status_id) {
        case "ALPA":
          status = 1
          break
        case "HADIR":
          status = 2
          break
        case "SAKIT":
          status = 3
          break
        case "IZIN":
          status = 4
          break
        default:
          break
      }

      console.log("statusasas", status)
      console.log("idsasas", parseInt(id))
      console.log("description", description)
      // console.log("image", image)

      const getIdStudents = await dbService.students.findFirst({
        where: {
          id: parseInt(id),
        },
      })

      const updateNotAttendance = await dbService.not_attendances.create({
        data: {
          students_id: getIdStudents.id,
          description: description,
          // evidence_location: image ? image : null,
          updated_at: new Date(),
        },
      })

      const updateStudent = await dbService.students.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status_id: status,
        },
      })

      return res.status(200).json({
        status: 200,
        message: "Update Success",
        data: {
          students: updateStudent,
          details: updateNotAttendance,
        },
      })
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error.message ?? "Error While Update",
        stack: error,
      })
    }
  }
}

cron.schedule("0 13 * * *", function () {
  const notAttendanceController = new NotAttendanceController()
  notAttendanceController.createNotAttendance()
})

cron.schedule("45 13 * * *", function () {
  const notAttendanceController = new NotAttendanceController()
  notAttendanceController.updateStudentsEmployee()
})

module.exports = NotAttendanceController
