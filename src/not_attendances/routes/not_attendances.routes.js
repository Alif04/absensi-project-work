const express = require('express');
const router = express.Router();
const NotAttendanceController = require('../controller/not_attendances.controller');
const middleware = require('../../middleware/middleware');
const multer = require('multer');
const mime = require('mime-types');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/images/not_attendances');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '.' + mime.extension(file.mimetype));
  },
});

const upload = multer({ storage: storage });

const notAttendanceController = new NotAttendanceController();

router.patch(
  '/student/:id',
  middleware,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  notAttendanceController.updateStudent,
);

router.patch(
  '/employee/:id',
  middleware,
  upload.fields([{ name: 'image', maxCount: 1 }]),
  notAttendanceController.updateEmployee,
);

module.exports = router;
