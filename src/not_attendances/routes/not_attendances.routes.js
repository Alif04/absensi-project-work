const express = require('express');
const router = express.Router();
const NotAttendanceController = require('../controller/not_attendances.controller');
const middleware = require('../../middleware/middleware');

const notAttendanceController = new NotAttendanceController();

router.patch('/:id', middleware, notAttendanceController.update);

module.exports = router;
