const express = require("express");
const router = express.Router();

const {
    insertPost,
    getAllPost,
    updatePost,
    deletePost,
    searchPost
    

  } =require("../controllers/post.js");
  router.get("/", getAllPost);
  router.post("/", insertPost);
  router.put("/:id", updatePost);
  router.delete("/:id", deletePost);
  router.get("/search", searchPost);
  
  
  
  
module.exports = router;