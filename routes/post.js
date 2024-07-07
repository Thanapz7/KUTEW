const express = require("express");
const router = express.Router();

const {
    insertPost,
    getAllPost,
    updatePost,
    deletePost
    

  } =require("../controllers/post.js");
  router.get("/", getAllPost);
  router.post("/", insertPost);
  router.put("/:id", updatePost);
  router.delete("/:id", deletePost);
  
  
  
module.exports = router;