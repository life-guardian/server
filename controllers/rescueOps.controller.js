const mongoose = require("mongoose");
const Agency = require("../models/agencyModel.js");
const Event = require("../models/eventModel.js");
const ROperation = require("../models/rescueOperationModel.js");

//agency
const startRescueOps = async (req, res) => {

  const { name, description, latitude, longitude, rescueTeamSize } = req.body;

  try {
    const location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
    const rescueOps = new ROperation({
      name,
      description,
      agencyId: req.user.id,
      agencyLocation: location,
      rescueTeamSize: Number(rescueTeamSize),
    });
    await rescueOps.save();
    res.status(200).json({ message: "Rescue operation created" });
  } catch (error) {
    console.error(`Error starting rescue operation: ${error}`);
    return res.status(500).json({ message: "Error starting rescue operation" });
  }
};

module.exports = { startRescueOps };
