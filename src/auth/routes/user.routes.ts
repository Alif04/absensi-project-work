import express from "express";
const router = express.Router();
import AuthController from "../controller/user.controller";

const authController = new AuthController();

router.post("/login", authController.login);
router.post("/register", authController.register);

export = router;
