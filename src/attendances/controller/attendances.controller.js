const { PrismaClient } = require('@prisma/client');
const { insideCircle } = require('geolocation-utils');
const prisma = new PrismaClient();


class AttendanceController {
    async create(req, res) {

        const { student_id, employee_id, lat, lon } = req.body
        if (!req.files || !req.files['image']) {
            return res
                .status(400)
                .json({ message: "File image and file are required" });
        }
        try {
            // console.log(typeof lat, typeof lon);
            const image = req.files['image'][0].filename;
            let data;
            const radius = 100;
            const lat1 = -6.6449872;
            const lon1 = 106.8429252;
            const location1 = { lat: Number(lat), lon: Number(lon) };
            const location2 = { lat: lat1, lon: lon1 }
            const circle = insideCircle(location2, location1, radius);
            if (circle) {
                if (student_id) {
                    data = {
                        students: {
                            connect: {
                                id: Number(student_id)
                            }
                        },
                        time: new Date(),
                        attendances_evidence: image,
                    }

                    await prisma.students.update({
                        where: {
                            id: Number(student_id)
                        },
                        data: {
                            status: true
                        }
                    })
                } else if (employee_id) {
                    data = {
                        employee: {
                            connect: {
                                id: Number(employee_id)
                            }
                        },
                        attendances_evidence: image,
                        time: new Date().toLocaleString(),
                        
                    }
                    await prisma.employee.update({
                        where: {
                            id: Number(employee_id),
                        },
                        data: {
                            status: true
                        }
                    })
                }

                await prisma.attendances.create({
                    data,
                    include: {
                        employee: employee_id ? true : false,
                        students: student_id ? true : false
                    }
                })

                // TODO: SEND WHATSAPP MESSAGE AFTER ATTENDANCES
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'Your Location is Invalid'
                })
            }

            return res.status(201).json({
                status: 201,
                message: 'Attendances created',
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: 400,
                message: 'Error while Create',
                stack: error
            })
        }
    }

    async getStudent(req, res) {
        try {
            const { search } = req.query;

            const students = await prisma.students.findMany({
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
                                ],
                            }
                            : {},
                        {
                            status: true,
                        },
                    ],
                },
                include: {
                    attendance: true,
                    rayon: true,
                    rombel: true
                },
            })

            return res.status(200).json({
                status: 200,
                message: 'Get Attendances',
                data: students
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: 400,
                message: 'Error While Get',
                stack: error
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
                                                contains: search
                                            }
                                        }
                                    },
                                    
                                ],
                            }
                            : {},
                        {
                            status: true,
                        },
                    ],
                },
                include: {
                    attendances: true,
                    rayon: true,
                    roles: true
                },
            })

            return res.status(200).json({
                status: 200,
                message: 'Get Attendances',
                data: employee
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                status: 400,
                message: 'Error While Get',
                stack: error
            });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params.id
            const { student_id, employee_id } = req.body
            if (!req.files || !req.files['image']) {
                return res
                    .status(400)
                    .json({ message: "File image and file are required" });
            }
            const image = req.files['image'][0].filename;
            let data;
            if (student_id) {
                data = {
                    students: {
                        connect: {
                            id: student_id
                        }
                    },
                    time: new Date(),
                    attendances_evidence: image
                }
            } else if (employee_id) {
                data = {
                    employee: {
                        connect: {
                            id: employee_id
                        }
                    },
                    attendances_evidence: image,
                    time: new Date()
                }
            }

            const attendance = await prisma.attendances.update({
                where: {
                    id
                },
                data,
                include: {
                    employee: employee_id ? true : false,
                    students: student_id ? true : false
                }
            })
            return res.status(200).json({
                status: 200,
                message: 'Attendances updated',
            })
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: 'Error While Update',
                stack: error
            });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params.id;
            const attendance = await prisma.attendances.delete({
                where: {
                    id
                }
            });

            return res.status(200).json({
                status: 200,
                message: 'Attendance Deleted'
            })
        } catch (error) {
            return res.status(400).json({
                status: 400,
                message: 'Error While Update',
                stack: error
            });
        }
    }
}

module.exports = AttendanceController;