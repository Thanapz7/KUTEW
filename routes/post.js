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

  /**
 * @swagger
 * /post:
 *  get:
 *     summary: Get all posts
 *     description: Get all posts
 *     responses:
 *       200:
 *         description: An array of post objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/posts'
 *       500:
 *         description: Some error happened
 */
  router.get("/", getAllPost);

  /**
 * @swagger
 * /post:
 *  post:
 *     summary: Insert a new post
 *     description: Insert a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/posts'
 *     responses:
 *       201:
 *         description: The post was created successfully
 *       400:
 *         description: The request was invalid
 *       500:
 *         description: Some error happened
 */
  router.post("/", insertPost);

  /**
 * @swagger
 * /post/{id}:
 *  put:
 *     summary: Update a post by id
 *     description: Update a post by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/posts'
 *     responses:
 *       200:
 *         description: The post was updated successfully
 *       400:
 *         description: The request was invalid
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Some error happened
 */
  router.put("/:id", updatePost);

  /**
 * @swagger
 * /post/{id}:
 *  delete:
 *     summary: Delete a post by id
 *     description: Delete a post by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the post to delete
 *     responses:
 *       200:
 *         description: The post was deleted successfully
 *       404:
 *         description: The post was not found
 *       500:
 *         description: Some error happened
 */
  router.delete("/:id", deletePost);

  /**
 * @swagger
 * /post/search/{keyword}
 *  get:
 *     summary: Search posts by keyword
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *         description: The keyword to search in post details, tags, or location.
 *     responses:
 *       200:
 *         description: An array of post objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/posts'
 *       500:
 *         description: Some error happened
 */
  router.get("/search/:keyword", searchPost);

    /**
 * @swagger
 * /myp:
 *  get:
 *     summary: Get My posts
 *     description: Get My posts
 *     responses:
 *       200:
 *         description: An array of post objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/posts'
 *       500:
 *         description: Some error happened
 */
  router.get("/myp", getMyPost);
  
  
  
  
module.exports = router;