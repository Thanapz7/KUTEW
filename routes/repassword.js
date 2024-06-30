const express = require("express");
const router = express.Router();

const {
    SendOTP,
    VerifyOTP,
    NewPassword

  } =require("../controllers/repassword");
  router.post("/send-otp", SendOTP);
  router.post("/verify-otp", VerifyOTP);
  router.post("/newpass", NewPassword);
  

module.exports = router;