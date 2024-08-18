const express = require("express");
const router = express.Router();

const {
    getAllTutors,
    getAllStudents,
    getAllUsers,
    StudentgetUser,
    TutorgetUser,
    getTutordata
    

  } =require("../controllers/user");
  router.get("/t", getAllTutors);
  router.get("/s", getAllStudents);
  router.get("/u", getAllUsers);
  router.get("/su/:id", StudentgetUser);
  router.get("/tu/:id", TutorgetUser);
  router.get("/tdata/:id", getTutordata);
  
  
  
  
module.exports = router;