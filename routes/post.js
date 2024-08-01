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
  /**
 * @swagger
 * /post/{id}:
 *  get:
 *     summary: Get a post by id
 *     description: Get a post by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the post to get
 *     responses:
 *       200:
 *         description: A post object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/posts'
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Some error happened
 */
  router.get("/:id", getPostById);
  router.get("/", getAllPost);
  router.post("/", insertPost);
  router.put("/:id", updatePost);
  router.delete("/:id", deletePost);
  router.get("/search", searchPost);
  router.get("/myp", getMyPost);
  
  
  
  
module.exports = router;