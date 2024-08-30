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
    getTutorByJoinId,
    getStudentpay,
    updatepoststatus,
    getpoststatus


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
  router.get("/studentpay/:join_id/:student_id", getStudentpay);
  router.put("/postdone/:post_id", updatepoststatus);
  router.get("/postdone/:post_id" , getpoststatus)



  

module.exports = router;