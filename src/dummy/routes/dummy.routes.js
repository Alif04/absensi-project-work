const express = require('express');
const DummyController = require('../controller/dummy.controller');
const middleware = require('../../middleware/middleware');
const router = express.Router();

const controller = new DummyController();

router.post('/create-student', middleware, controller.createStudent);
router.post('/create-employee', middleware, controller.createEmployee);
router.get('/get-rayon', controller.getRayon);
router.get('/get-rombel', controller.getRombel);
router.get('/get-status', controller.getStatus);
router.get('/get-role', controller.getRole);

module.exports = router;
