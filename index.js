const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/user");

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
  console.log(req.body);
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
    console.log(response);
  } catch (error) {
    console.log(error.code == 11000);
    if (error.code == 11000) {
      console.log("inside");
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
  console.log(req.body);
  const userData = await User.findOne({ username }).lean();
  if (!userData)
    return res.json({
      status: "error",
      error: "User Data doesn't exists",
    });
  if (await bcrypt.compare(plainTextPassword, userData.password)) {
    return res.json({
      status: "Ok",
      data: "",
    });
  }
  return res.json({
    status: "error",
    error: "User Data doesn't exists",
  });
  console.log(userData);
  try {
  } catch (error) {}
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is on" + port));
