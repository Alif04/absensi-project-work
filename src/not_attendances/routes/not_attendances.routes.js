const express = require('express');
const router = express.Router();
const NotAttendanceController = require('../controller/not_attendances.controller');

const notAttendanceController = new NotAttendanceController();

router.get('/students', notAttendanceController.getStudents);
router.get('/employee', notAttendanceController.getStudents);

module.exports = router;