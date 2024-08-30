const express = require("express");
const router = express.Router();

const {
    getAllTutorsPending,
    updateAcceptTutor,
    updateDenyTutor,
    getUserActivity

  } =require("../controllers/admin.js");
  router.get("/tutorstatus", getAllTutorsPending);
  router.put("/accept/:id", updateAcceptTutor);
  router.put("/deny/:id", updateDenyTutor);
  router.put("/count", getUserActivity);

  
module.exports = router;