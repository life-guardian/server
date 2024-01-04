const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Agency = require("../models/agencyModel.js");
const Event = require("../models/eventModel.js");
const ROperation = require("../models/rescueOperationModel.js");
const { validationResult } = require("express-validator");

const agencyRegister = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    return res.status(403).json({ message: validationErrors.errors[0].msg });
  }

  try {
    let {
      agencyName,
      agencyEmail,
      agencyPhNo,
      password,
      address,
      representativeName,
    } = req.body;

    const mobNum = Number(`91${agencyPhNo}`);
    const hashedPassword = await bcrypt.hash(password, 10);

    const isAlreadyPresent = await Agency.findOne({
      $or: [{ email: agencyEmail }, { phone: mobNum }],
    });

    if (isAlreadyPresent) {
      return res.status(400).json({
        message: "Agency already present with the email or phone number",
      });
    }

    const agency = await Agency.create({
      name: agencyName,
      email: agencyEmail.toLowerCase(),
      password: hashedPassword,
      phone: mobNum,
      representativeName,
      address,
    });

    const token = jwt.sign(
      { id: agency._id, isAgency: true },
      process.env.JWT_SECRET_KEY
    );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "development" ? false : true,
    // });

    return res.status(200).json({ message: "Agency registered", token: token });
  } catch (error) {
    console.error(`Error in registering agency: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const agencyLogin = async (req, res) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log(validationErrors);
    res.status(403).json({ message: validationErrors.errors[0].msg });
    return;
  }
  const { username, password } = req.body;

  try {
    let agency;

    if (isNaN(username)) {
      // If username is not a number, find by email
      agency = await Agency.findOne({ email: username });
    } else {
      // If username is a number, find by phone
      agency = await Agency.findOne({ phone: Number(`91${username}`) });
    }

    if (!agency)
      return res.status(404).json({ message: "Agency not registered" });

    const match = await bcrypt.compare(password, agency.password);

    if (match) {
      const token = jwt.sign(
        { id: agency._id, isAgency: true },
        process.env.JWT_SECRET_KEY
      );

      // res.cookie("token", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "development" ? false : true,
      // });

      return res
        .status(200)
        .json({ message: "Login successfull", token: token });
    } else {
      return res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error(`Error in Login : ${error}`);
    return res.status(500).json({ message: "Login failed" });
  }
};


const eventAndRescueOperationCount = async (req, res) => {
  try {
    const rescueOperationsCount = await ROperation.countDocuments({
      agencyId: req.user.id,
    });
    const eventsCount = await Event.countDocuments({ agencyId: req.user.id });

    const agency = await Agency.findById(req.user.id);
    const agencyName = agency.name;

    res.status(200).json({ agencyName, rescueOperationsCount, eventsCount });
  } catch (error) {
    console.error(`Error in eventAndRescueOperationCount : ${error}`);
    return res.status(500).json({
      message:
        "Failed to fetch agencyName rescueOperationsCount and eventsCount",
    });
  }
};

module.exports = {
  agencyRegister,
  agencyLogin,
  eventAndRescueOperationCount,
};
