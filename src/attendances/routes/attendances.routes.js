const express = require('express');
const multer = require('multer');
const mime = require('mime-types');
const AttendanceController = require('../controller/attendances.controller');
const middleware = require('../../middleware/middleware');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/images/attendances');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.' + mime.extension(file.mimetype));
  },
});

const upload = multer({ storage: storage });
const attendancesController = new AttendanceController();

router.get('/student', middleware, attendancesController.getStudent);
router.get('/employee', middleware, attendancesController.getEmployee);
router.post(
  '/',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  middleware,
  attendancesController.create,
);
router.get('/import-excel', middleware, attendancesController.importExcel);
router.patch(
  '/:id',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  middleware,
  attendancesController.update,
);
router.delete('/:id', attendancesController.delete);

module.exports = router;
