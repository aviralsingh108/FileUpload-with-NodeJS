const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const routes = require("./routes/routes");

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
app.use("/", express.static(path.join(__dirname, "ui")));
app.use("/", routes);

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is on" + port));
