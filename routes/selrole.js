const express = require("express");
const router = express.Router();

const {
    AddTutor,
    AddStudent,
    FormStatus,
    UpdateForm

  } =require("../controllers/selrole.js");
  router.post("/tutor", AddTutor);
  router.post("/student", AddStudent);
  router.post("/form", UpdateForm);
  router.get("/form", FormStatus);
  
module.exports = router;