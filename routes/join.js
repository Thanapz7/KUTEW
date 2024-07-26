const express = require("express");
const router = express.Router();


const {
    insertJoin


  } =require("../controllers/join");
  router.post("/:id", insertJoin);

  

module.exports = router;