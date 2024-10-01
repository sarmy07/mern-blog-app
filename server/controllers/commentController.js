const Comment = require("../models/Comment");

const createComment = async (req, res) => {
  try {
    const { content, postId, id } = req.body;

    if (id !== req.user.id) {
      return res.status(400).json({ msg: "FORBIDDEN" });
    }

    const newComment = new Comment({
      content,
      postId,
      id,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    console.log(error.message);
  }
};

const getPostsComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log(error.message);
  }
};

const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error.message);
  }
};

const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    if (comment.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    console.log(error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }
    if (comment.id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment deleted!");
  } catch (error) {
    console.log(error);
  }
};

const getComments = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.json(403).json("Forbidden");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "dsc" ? -1 : 1;
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip({ startIndex })
      .limit({ limit });

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return (
      res.status(200).json({ lastMonthComments, totalComments, comments })
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createComment,
  getPostsComments,
  likeComment,
  editComment,
  deleteComment,
  getComments,
};
