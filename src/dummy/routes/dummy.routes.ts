import express from "express";
import DummyController from "../controller/dummy.controller";
import middleware from "../../middleware/middleware";
const router = express.Router();

const controller = new DummyController();

router.post("/create-student", middleware, controller.createStudent);
router.post("/create-employee", middleware, controller.createEmployee);
router.get("/get-rayon", controller.getRayon);
router.get("/get-rombel", controller.getRombel);
router.get("/get-status", controller.getStatus);
router.get("/get-role", controller.getRole);

export = router;
