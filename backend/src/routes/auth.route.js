//   AUTH.ROUTER TELL KON KON SE API HAI JO AUTH SE RELATED HAI
const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { registerController, loginController, meController, logoutController } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");


const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", authMiddleware, meController);
router.post("/logout", logoutController);

module.exports = router;
  