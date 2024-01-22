const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const AttendanceController = require('../controller/attendances.controller');
const middleware = require('../../middleware/middleware');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const attendancesController = new AttendanceController();

const resizeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageBuffer = req.file.buffer;

    const resizedImageBuffer = await sharp(imageBuffer)
      .resize({ width: 500 }) // Ganti dengan ukuran yang diinginkan
      .toBuffer();

    req.resizedImageBuffer = resizedImageBuffer;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error processing image' });
  }
};

router.get('/student', middleware, attendancesController.getStudent);
router.get('/employee', middleware, attendancesController.getEmployee);
router.post(
  '/',
  upload.single('image'),
  middleware,
  resizeImage,
  attendancesController.create,
);
router.get('/import-excel', middleware, attendancesController.importExcel);
router.patch(
  '/:id',
  upload.single('image'),
  middleware,
  resizeImage,
  attendancesController.update,
);
router.delete('/:id', attendancesController.delete);

module.exports = router;
