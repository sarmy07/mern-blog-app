const jwt = require("jsonwebtoken");

const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ msg: "Not Authorized!" });
  }
  jwt.verify(token, process.env.secret, (err, user) => {
    if (err) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyUser;
