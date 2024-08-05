const express = require("express");
const router = express.Router();

const {
    InsertNotifications

  } =require("../controllers/notifications");
  router.post("/notifications", InsertNotifications);

  

module.exports = router;
