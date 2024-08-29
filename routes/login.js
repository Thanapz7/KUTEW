const express = require("express");
const router = express.Router();
const recordUserActivity = require('../middleware');

const {
    LoginSignup,
    LoginSignin,

  } =require("../controllers/login");
  router.post("/signup", LoginSignup);
  router.post("/signin",recordUserActivity , LoginSignin);
  

module.exports = router;