const Post = require("../models/Post");

const create = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: "FORBIDDEN" });
  }

  if (!req.body.title || !req.body.content) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    id: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.log(error.message);
  }
};

const getPosts = async (req, res) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.id && { id: req.query.id }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    return res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  if (!req.user.isAdmin || req.user.id !== req.params.id) {
    return res.status(403).json({ msg: "FORBIDDEN" });
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    return res.status(200).json({ msg: "Post Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};

const updatePost = async (req, res) => {
  if (!req.user.isAdmin || req.user.id !== req.params.id) {
    return res.status(403).json({ msg: "FORBIDDEN" });
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { create, getPosts, deletePost, updatePost };
