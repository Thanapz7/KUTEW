const express = require("express");
const router = express.Router();

const {
    GetGroup,
    CreateChatGroupWithMembers,
    CreateChatGroupWithAdmin,
    CreateChatGroupWithAdminForTutor

  } =require("../controllers/chat.js");
  router.get("/groups", GetGroup);
  router.post("/groups/:tutor_id/:post_id", CreateChatGroupWithMembers);
  router.post("/groupadmin", CreateChatGroupWithAdmin);
  router.post("/groupadmin/:tutor_id", CreateChatGroupWithAdminForTutor);
  //router.post("/groups", CreateChatGroupWithMembers); //ใช้test

  
module.exports = router;