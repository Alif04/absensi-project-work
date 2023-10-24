const express = require('express');
const router = express.Router();
const AuthController = require('../controller/user.controller');

const authController = new AuthController();

router.post('/login', authController.login);

module.exports = router; 