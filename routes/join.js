const express = require("express");
const router = express.Router();


const {
    insertJoin,
    getJoin,
    getMyJoin,
    updateJoinAccept,
    updateJoinDeny,
    updateJoinPayment,
    checkJoinStatus,
    getUserIdByJoinId,
    getTutorByJoinId


  } =require("../controllers/join");
  router.post("/:id", insertJoin);
  router.get("/:id", getJoin);
  router.get("/my/:id", getMyJoin);
  router.put("/a/:id", updateJoinAccept);
  router.put("/d/:id", updateJoinDeny);
  router.put("/pay/:id", updateJoinPayment);
  router.get("/status/:id", checkJoinStatus);
  router.get("/user/:id", getUserIdByJoinId);
  router.get("/tutor/:id", getTutorByJoinId);



  

module.exports = router;