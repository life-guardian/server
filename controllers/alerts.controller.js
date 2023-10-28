const User = require("../models/userModel.js");
const mongoose = require("mongoose");
const { updateUsersLastLocation } = require("../utils/usersLastLocation.js");
const Alert = require("../models/alertModel.js");

//agency
const sendAlert = async (req, res) => {
  try {
    //location coordinates is array field with Longitude and lattitude
    const { locationCoordinates, alertName, alertSeverity, alertForDate } =
      req.body;

    alertLocation = {
      type: "Point",
      coordinates: [
        parseFloat(locationCoordinates[0]),
        parseFloat(locationCoordinates[1]),
      ],
    };

    await Alert.create({
      alertName,
      alertSeverity,
      alertForDate,
      alertLocation,
    });

    return res.status(200).json({ message: "Alert created successfully" });
  } catch (error) {
    console.error(`Error in creating alert`);
    return res
      .status(500)
      .json({ message: "Error in creating alert" });
  }
};

module.exports = {
  uodateLastLocationUser,
};
