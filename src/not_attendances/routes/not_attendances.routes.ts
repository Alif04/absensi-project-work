import express from "express"
const router = express.Router()
import NotAttendanceController from "../controller/not_attendances.controller"
import middleware from "../../middleware/middleware"
import multer from "multer"
import mime from "mime-types"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/images/not_attendances")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "." + mime.extension(file.mimetype))
  },
})

const upload = multer({ storage: storage })
const notAttendanceController = new NotAttendanceController()

router.patch(
  "/:id",
  middleware,
  upload.fields([{ name: "image", maxCount: 1 }]),
  notAttendanceController.updateStudents
)
router.patch(
  "/status/:id",
  // upload.fields([{ name: "image", maxCount: 1 }]),
  middleware,
  notAttendanceController.updateStatus
)

export default router
