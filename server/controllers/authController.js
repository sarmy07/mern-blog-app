const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  const userExits = await User.findOne({ email });
  if (userExits) {
    return res.status(400).json({ msg: "User already exits" });
  }
  const hashPassword = await bcrypt.hash(password, 10);
  //   console.log("hashed-password:", hashPassword);

  const user = await User.create({ username, email, password: hashPassword });
  if (user) {
    return res.status(201).json(user);
  } else {
    return res.status(404).json({ msg: "Something went wrong" });
  }
};

//
const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ msg: "Inavlid Login Credentials" });
  }

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.secret,
    {
      expiresIn: "1h",
    }
  );

  const { password: pass, ...rest } = user._doc;
  return res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .json(rest);
};

const google = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.secret
      );
      const { password, ...rest } = user._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(12).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.secret
      );
      const { password, ...rest } = newUser._doc;
      return res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.log(error);
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("log out success!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = { signup, signin, google, signout };
