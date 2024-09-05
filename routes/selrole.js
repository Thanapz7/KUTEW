const express = require("express");
const router = express.Router();

const {
    AddTutor,
    AddStudent,
    FormStatus,
    UpdateForm,
    UpdateProfilePic

  } =require("../controllers/selrole.js");
  router.post("/tutor", AddTutor);
  router.post("/student", AddStudent);
  router.post("/form", UpdateForm);
  router.get("/form", FormStatus);
  router.post("/newpic", UpdateProfilePic);
  
module.exports = router;