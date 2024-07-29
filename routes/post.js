const express = require("express");
const router = express.Router();

const {
    insertPost,
    getAllPost,
    updatePost,
    deletePost,
    searchPost,
    getMyPost,
    getPostById
    

  } =require("../controllers/post.js");
  router.get("/", getAllPost);
  router.get("/:id", getPostById);
  router.post("/", insertPost);
  router.put("/:id", updatePost);
  router.delete("/:id", deletePost);
  router.get("/search", searchPost);
  router.get("/myp", getMyPost);
  
  
  
  
  
module.exports = router;