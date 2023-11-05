const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { updateUsersLastLocation } = require("../utils/userLocation.js");
const { validationResult } = require("express-validator");

const userRegister = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    res.status(403).json({ message: validationErrors.errors[0].msg });
    return;
  }

  try {
    let { name, password, phoneNumber, email, address, locationCoordinates } =
      req.body;

    const mobNum = Number(phoneNumber);
    const hashedPassword = await bcrypt.hash(password, 10);

    const alreadyPresent = await User.findOne({
      $or: [{ email }, { phoneNumber: mobNum }],
    });

    if (alreadyPresent) {
      return res.status(400).json({
        message: "User already present with the email or phone number",
      });
    }

    //longitude first and lattitude second
    lastLocation = {
      type: "Point",
      coordinates: [parseFloat(locationCoordinates[0]), parseFloat(locationCoordinates[1])],
    };

    const user = await User.create({
      name,
      password: hashedPassword,
      phoneNumber: mobNum,
      email: email.toLowerCase(),
      address: address,
      lastLocation,
      lastLocationUpdatedAt: Date.now()
    });

    const token = jwt.sign(
      { email: user.email, id: user._id, isAgency: false },
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

    res.status(200).json({ message: "Account created", token: token });
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
  const { username, password, locationCoordinates } = req.body;

  try {

    let user;

    if (isNaN(username)) {
      // If username is not a number, find by email
      user = await User.findOne({ email: username });
    } else {
      // If username is a number, find by phone
      user = await User.findOne({ phoneNumber: Number(username) });
    }
    if (!user)
      return res.status(404).json({ message: "Account not registered" });

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign(
        { email: user.email, id: user._id, isAgency: false },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: process.env.JWT_TOKEN_EXPIRATION,
        }
      );

      //updating lastLocation of user
      //longitude first and lattitude second
      const result = await updateUsersLastLocation(
        user._id,
        locationCoordinates
      );
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      const cookieExpiration = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days in milliseconds

      res.cookie("token", token, {
        httpOnly: true,
        expires: cookieExpiration,
        secure: process.env.NODE_ENV === "development" ? false : true,
      });

      return res.status(200).json({ message: "Login successfull", token: token });
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

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    console.error(`Error in Logout : ${error}`);
    return res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
};
