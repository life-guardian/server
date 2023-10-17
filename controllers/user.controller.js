const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const userRegister = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    res.status(403).json({ message: validationErrors.errors[0].msg });
    return;
  }

  try {
    let { firstName, lastName, password, phoneNumber, email, address } =
      req.body;

    const mobNum = Number(phoneNumber);
    const hashedPassword = await bcrypt.hash(password, 10);

    const alreadyPresent = await User.findOne({
      $or: [{ email }, { phoneNumber: mobNum }],
    });

    if (alreadyPresent) {
      return res.status(400).json({
        message: "User already present with the mobile number or email",
      });
    }

    const user = await User.create({
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      password: hashedPassword,
      phoneNumber: mobNum,
      email: email.toLowerCase(),
      address: address,
    });

    res.status(200).json({ message: "Account created" });
  } catch (error) {
    console.error(`Error in Registration : ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    res.status(403).json({ message: validationErrors.errors[0].msg });
    return;
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(404).json({ message: "Account not registered" });

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_TOKEN_EXPIRATION,
        }
      );

      const cookieExpiration = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days in milliseconds

      res.cookie("token", token, {
        httpOnly: true,
        expires: cookieExpiration,
        secure: process.env.NODE_ENV === "development" ? false : true,
      });

      return res.status(200).json({ message: "Login successful!" });
    } else {
      return res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error(`Error in Login : ${error}`);
    return res.status(500).json({ message: "Login failed" });
  }
};

const userLogout = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(`Error in Logout : ${error}`);
    return res.status(500).json({ message: "Logout failed" });
  }
};

const checkIfLoggedIn = async (req, res) => {
  try {
    return res.status(200).json({ message: "User is logged in" });
  } catch (error) {
    console.error(`Error in checkIfLoggedIn : ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  checkIfLoggedIn,
};
