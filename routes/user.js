const express = require("express");
const router = express.Router();

const {
    getAllTutors,
    getAllStudents,
    getAllUsers,
    StudentgetUser,
    TutorgetUser,
    getTutordata,
    getStudentdata,
    getAllTutorsByID

  } =require("../controllers/user");
  router.get("/t", getAllTutors);
  router.post("/t/:tutor_id", getAllTutorsByID);
  router.get("/s", getAllStudents);
  router.get("/u", getAllUsers);
  router.get("/su/:id", StudentgetUser);
  router.get("/tu/:id", TutorgetUser);
  router.get("/tdata/:id", getTutordata);
  router.get("/sdata/:id", getStudentdata);
  

module.exports = router;