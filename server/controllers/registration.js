const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

async function registration(req, res) {
  const { username, password: plainTextPassword } = req.body;
  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid Username" });
  }
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }
  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password length shouldn't be lesser than 5 characters",
    });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const response = await User.create({
      username,
      password,
    });
  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).json({
        status: "error",
        error: "Username already in use",
      });
    }
    throw error;
  }
  res.json({ status: "ok" });
}

module.exports = { registration };
