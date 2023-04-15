const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const JWT_SECRET = "jsonwebtokensecretisalwayssecretasweallknowblinkblink";

//Connect DB using Mongoose
mongoose
  .connect("mongodb://localhost:27017/fileUpload", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connectiong to MongoDB", err));

//create express app
const app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "static")));

// API's
//Resgiteration
app.post("/api/register", async (req, res) => {
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
});

//Login
app.post("/api/login", async (req, res) => {
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
});

// Change Password
app.post("/api/change-password", async (req, res) => {
  const { token, newPassword: plainTextPassword } = req.body;

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid Password" });
  }
  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password length shouldn't be lesser than 5 characters",
    });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const _id = user.id;
    const password = await bcrypt.hash(plainTextPassword, 10);
    await User.updateOne(
      { _id },
      {
        $set: { password },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: "mehnat karo" });
  }
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is on" + port));
