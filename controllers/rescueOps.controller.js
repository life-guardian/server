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

    await Agency.findByIdAndUpdate(req.user.id, { $set: { onGoingRescueOperation: rescueOps._id }});

    res.status(200).json({ message: "Rescue operation started", rescueOpsId: rescueOps._id });
  } catch (error) {
    console.error(`Error starting rescue operation: ${error}`);
    return res.status(500).json({ message: "Error starting rescue operation" });
  }
};

//agency
const stopRescueOps = async (req, res) => {
  const rescueOpsId = req.params.rescueOpsId;

  try {
    const stoppedRescueOps = await ROperation.findOneAndUpdate(
      {
        _id: rescueOpsId,
        agencyId: req.user.id,
      },
      { $set: { status: "stopped" } }
    );

    if (!stoppedRescueOps) {
      return res.status(404).json({ message: "Rescue operation not found" });
    }
    await Agency.findByIdAndUpdate(req.user.id, { $set: { onGoingRescueOperation: null } });

    res.status(200).json({ message: "Rescue operation stopped" });
  } catch (error) {
    console.error(`Error in stopping Rescue operation: ${error}`);
    return res.status(500).json({ message: "Error in stopping rescue operation" });
  }
};

//agency
const deleteRescueOps = async (req, res) => {
  const rescueOpsId = req.params.rescueOpsId;

  try {
    const deletedRescueOps = await ROperation.findOneAndDelete({
      _id: rescueOpsId,
      agencyId: req.user.id,
    });

    if (!deletedRescueOps) {
      return res.status(404).json({ message: "Rescue operation not found" });
    }

    res.status(200).json({ message: "Rescue operation deleted successfully" });
  } catch (error) {
    console.error(`Error in deleting Rescue operation: ${error}`);
    return res.status(500).json({ message: "Error in deleting rescue operation" });
  }
};

//agency
const isRescueOperationOnGoing = async (req, res) => {

  try {
    const agency = await Agency.findById(req.user.id);
    let response = {
        isRescueOperationOnGoing: false,
        rescueOpsId: null
    };
    if(agency.onGoingRescueOperation!==null){
      response = {
        isRescueOperationOnGoing: true,
        rescueOpsId: agency.onGoingRescueOperation
      }
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(`Error fetching onGoingRescueOperation status: ${error}`);
    return res.status(500).json({ message: "Error fetching onGoingRescueOperation status" });
  }
};


module.exports = { startRescueOps, deleteRescueOps, stopRescueOps, isRescueOperationOnGoing };
