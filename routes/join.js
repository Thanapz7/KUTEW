const express = require("express");
const router = express.Router();


const {
    insertJoin,
    getJoin,
    updateJoinAccept,
    updateJoinDeny,
    updateJoinPayment,
    checkJoinStatus


  } =require("../controllers/join");
  router.post("/:id", insertJoin);
  router.get("/:id", getJoin);
  router.put("/a/:id", updateJoinAccept);
  router.put("/d/:id", updateJoinDeny);
  router.put("/pay/:id", updateJoinPayment);
  router.get("/status/:id", checkJoinStatus);

  

module.exports = router;