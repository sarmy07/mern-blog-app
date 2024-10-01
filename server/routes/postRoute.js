const express = require("express");
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const {
  create,
  getPosts,
  deletePost,
  updatePost,
} = require("../controllers/postController");

router.post("/create", verifyUser, create);
router.get("/getposts", getPosts);
router.delete("/delete/:postId/:id", verifyUser, deletePost);
router.put("/update/:postId/:id", verifyUser, updatePost);

module.exports = router;
