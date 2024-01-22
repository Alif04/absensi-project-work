const router = require('express').Router()
const fs = require("fs");
const AuthController = require('../controller/user.controller')
const qrcode = require('qrcode-terminal');


const authController = new AuthController();

router.post("/login", authController.login);
router.post("/register", authController.register);

router.get("/checkauth", async (req, res) => {
  client
    .getState()
    .then((data) => {
      console.log(data);
      return res.json(data);
    })  
    .catch((err) => {
      if (err) {
        return res.json({message: "DISCONNECTED"});
      }
    });
});

router.get("/getqr", async (req, res) => {
  client
    .getState()
    .then((data) => {
      if (data) {
        res.write("<html><body><h2>Already Authenticated</h2></body></html>");
        res.end();
      } else {
        sendQr(res);
      }
    })
    .catch(() => {
      sendQr(res);
      return res.json({
        message: "Success"
      })
    });
});

function sendQr(res) {
  fs.readFile("components/last.qr", (err, last_qr) => {
    if (!err && last_qr) {
      qrcode.generate(last_qr, { small: true });
      res.end();
    }
  });
}

module.exports = router;
