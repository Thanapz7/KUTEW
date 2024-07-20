const express = require("express");
const router = express.Router();

const {
    insertPost,
    getAllPost,
    updatePost,
    deletePost,
    searchPost,
    getMyPost
    

  } =require("../controllers/post.js");
  router.get("/", getAllPost);
  router.post("/", insertPost);
  router.put("/:id", updatePost);
  router.delete("/:id", deletePost);
  router.get("/search", searchPost);
  router.get("/myp", getMyPost);
  
  
  
  
module.exports = router;