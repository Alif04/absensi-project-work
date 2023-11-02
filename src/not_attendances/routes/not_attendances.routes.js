const express = require('express');
const router = express.Router();
const NotAttendanceController = require('../controller/not_attendances.controller');
const Middleware = require("../../middleware/middleware");


const notAttendanceController = new NotAttendanceController();
const middleware = new Middleware();


router.get('/students', middleware.middlewareKesiswaan,notAttendanceController.getStudents);
router.get('/students/by-rayon', middleware.middlewarePembimbing,notAttendanceController.getStudentsByRayon);
router.get('/employee', middleware.middlewareTU,notAttendanceController.getStudents);
router.patch('/:id', middleware.middlewareKesiswaan && middleware.middlewareTU, notAttendanceController.update)

module.exports = router;