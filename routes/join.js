const express = require("express");
const router = express.Router();


const {
    insertJoin,
    getJoin,
    updateJoinAccept,
    updateJoinDeny,
    updateJoinPayment


  } =require("../controllers/join");
  router.post("/:id", insertJoin);
  router.get("/:id", getJoin);
  router.put("/a/:id", updateJoinAccept);
  router.put("/d/:id", updateJoinDeny);
  router.put("/pay/:id", updateJoinPayment);

  

module.exports = router;