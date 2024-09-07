const express = require("express");
const router = express.Router();

const {
    getAllTutorsPending,
    updateAcceptTutor,
    DenyDeleteTutor,
    getUserActivity

  } =require("../controllers/admin.js");
  router.get("/tutorstatus", getAllTutorsPending);
  router.put("/accept/:id", updateAcceptTutor);
  router.delete("/deny/:id", DenyDeleteTutor);
  router.get("/count", getUserActivity);

  
module.exports = router;