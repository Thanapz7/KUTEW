const express = require("express");
const router = express.Router();

const {
    AddTutor,
    AddStudent,

  } =require("../controllers/selrole.js");
  router.post("/tutor", AddTutor);
  router.post("/student", AddStudent);
  
module.exports = router;