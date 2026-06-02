// CONTROLLER BTATA HAI KI API JKE ABNDR KYA HOGA AUR KESE HOGA
// USKI SARI FUNCTIONALITY CONTROLLER ME HOGI

const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerController(req, res) {
  const { username, password } = req.body;

  const isUserAlredyExist = await userModel.findOne({ username });

  if (isUserAlredyExist) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  const user = await userModel.create({
    username,
    password: await bcrypt.hash(password, 10),
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("Token", token);

  res.status(201).json({
    message: "User registered Successfully",
    user,
  });
}

async function loginController(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findOne({
    username,
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("Token", token);
  res.status(200).json({
    message: "User loggin Successfully",
    user: {
      username: user.username,
      id: user._id,
    },
  });
}

async function meController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({
      user: {
        username: req.user.username,
        id: req.user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function logoutController(req, res) {
  try {
    res.clearCookie("Token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  registerController,
  loginController,
  meController,
  logoutController,
};
