const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mime = require("mime-types");
const AttendanceController = require("../controller/attendances.controller");
const Middleware = require("../../middleware/middleware");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images/attendances");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + mime.extension(file.mimetype));
  },
});

const upload = multer({ storage: storage });
const attendancesController = new AttendanceController();
const middleware = new Middleware();

router.get("/student", middleware.middlewareKesiswaan ,attendancesController.getStudent);
router.get("/student/by-rayon", middleware.middlewarePembimbing ,attendancesController.getStudentByRayon);
router.get(
  "/employee",
  middleware.middlewareTU,
  attendancesController.getEmployee
);
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  middleware.middlewareAdmin,
  attendancesController.create
);
router.patch(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  middleware.middlewareKesiswaan && middleware.middlewareTU,
  attendancesController.update
);
router.delete("/:id", attendancesController.delete);

module.exports = router;
