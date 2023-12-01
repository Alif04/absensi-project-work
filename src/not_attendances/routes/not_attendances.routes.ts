import express from "express";
const router = express.Router();
import NotAttendanceController from "../controller/not_attendances.controller";
import middleware from "../../middleware/middleware";

const notAttendanceController = new NotAttendanceController();

router.patch("/:id", middleware, notAttendanceController.update);

export default router;
