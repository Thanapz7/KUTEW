const express = require("express");
const router = express.Router();

const {
    insertComment,
    ReportComment,
    RejectReportComment,
    GetAllCommentByIdTutor,
    GetAllCommentReport
    

  } =require("../controllers/comment.js");
  router.post("/:tutor_id", insertComment);
  router.put("/report/:comment_id", ReportComment);
  router.put("/reject/:comment_id", RejectReportComment);
  router.get("/:tutor_id", GetAllCommentByIdTutor);
  router.get("/", GetAllCommentReport);


  
module.exports = router;