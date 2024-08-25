const express = require("express");
const router = express.Router();

const {
    GetGroup,
    CreateChatGroupWithMembers

  } =require("../controllers/chat.js");
  router.get("/groups", GetGroup);
  router.post("/groups/:tutor_id/:post_id", CreateChatGroupWithMembers);
  //router.post("/groups", CreateChatGroupWithMembers); //ใช้test

  
module.exports = router;