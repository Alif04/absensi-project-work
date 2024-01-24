const router = require('express').Router()
const fs = require("fs");
const AuthController = require('../controller/user.controller')
const qrcode = require('qrcode-terminal');


const authController = new AuthController();

router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
