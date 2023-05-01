const path = require("path");
const User = require("../models/user");
const JWT_SECRET = "jsonwebtokensecretisalwayssecretasweallknowblinkblink";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function getLoginPage(req, res) {
  const { username, password: plainTextPassword } = req.body;
  const userData = await User.findOne({ username }).lean();
  if (!userData)
    return res.json({
      status: "error",
      error: "User Data doesn't exists",
    });
  if (await bcrypt.compare(plainTextPassword, userData.password)) {
    const token = jwt.sign(
      { id: userData._id, username: userData.username },
      JWT_SECRET
    );
    return res.json({
      status: "ok",
      data: token,
    });
  }
  return res.json({
    status: "error",
    error: "User Data doesn't exists",
  });
}

module.exports = { getLoginPage };
