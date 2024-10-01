const express = require("express");
const {
  createComment,
  getPostsComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
} = require("../controllers/commentController");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();

router.post("/create", verifyUser, createComment);
router.get("/getPostComments/:postId", getPostsComments);
router.put("/likeComment/:commentId", verifyUser, likeComment);
router.put("/editComment/:commentId", verifyUser, editComment);
router.delete("/deleteComment/:commentId", verifyUser, deleteComment);
router.get("/getcomments", verifyUser, getComments);

module.exports = router;
