const express = require("express");
const {
  updateUser,
  deleteUser,
  getUsers,
  getUser,
} = require("../controllers/userController");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router();

router.put("/update/:id", verifyUser, updateUser);
router.delete("/delete/:id", verifyUser, deleteUser);
router.get("/getusers", verifyUser, getUsers); /*****for admin */
router.get("/:id", getUser);

module.exports = router;
