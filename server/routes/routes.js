const express = require("express");
const router = express.Router();
const path = require("path");

// Importing controllers for each route
const loginController = require("./../controllers/login");
const registrationController = require("./../controllers/registration");
const changePasswordController = require("./../controllers/changePassword");
// const homeController = require("./controllers/homeController");

// Landing route
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../ui", "login", "login.html"));
});

//Registration
router.post("/api/register", registrationController.registration);

//Login
router.post("/api/login", loginController.getLoginPage);

// Change Password
router.post("/api/change-password", changePasswordController.changePassword);

module.exports = router;
