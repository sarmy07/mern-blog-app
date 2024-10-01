const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

const _dirname = path.resolve();
const mongo_url = `${process.env.MONGO_URI}`;
const port = process.env.PORT || 4050;

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/comment", commentRoute);

app.use(express.static(path.join(_dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

const connect = async () => {
  try {
    await mongoose.connect(mongo_url);
    console.log("connected to database");
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.log("could not connect to database because...");
    console.log(error);
  }
};

connect();
