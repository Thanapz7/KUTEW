const express = require("express");
const router = express.Router();

const {
    getAllTutors,
    getAllStudents,
    getAllUsers
    

  } =require("../controllers/user");
  router.get("/t", getAllTutors);
  router.get("/s", getAllStudents);
  router.get("/u", getAllUsers);
  
  
  
  
module.exports = router;