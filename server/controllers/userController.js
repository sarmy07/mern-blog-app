const bcrypt = require("bcrypt");
const User = require("../models/User");
//
const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ msg: "FORBIDDEN!" });
  }

  try {
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res
          .status(400)
          .json({ msg: "characters should be more than 6" });
      }
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password: pass, ...rest } = updatedUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    res.status(400).json({ msg: error.message });
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return res.status(400).json({ msg: "FORBIDDEN" });
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ msg: "User deleted!" });
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(400).json({ msg: "FORBIDDEN" });
    }
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    return res
      .status(200)
      .json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const { password: pass, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { updateUser, deleteUser, getUsers, getUser };
