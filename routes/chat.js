const express = require("express");
const router = express.Router();

const {
    GetGroup

  } =require("../controllers/chat.js");
  router.get("/groups", GetGroup);

  
module.exports = router;