const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");

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
app.post("/api/register", async (req, res) => {
  console.log(req.body);
  const { username, password: plainTextPassword } = req.body;
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const response = await User.create({
      username,
      password,
    });
    console.log(response);
  } catch (error) {
    return res.json({ status: error });
  }
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is on" + port));
