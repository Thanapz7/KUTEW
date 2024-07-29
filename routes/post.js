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
  router.post("/", insertPost);
  router.put("/:id", updatePost);
  router.delete("/:id", deletePost);
  router.get("/search", searchPost);
  router.get("/myp", getMyPost);
  router.get("/:id", getPostById);
  
  
  
  
module.exports = router;