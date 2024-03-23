const mongoose = require("mongoose");
const Agency = require("../models/agencyModel.js");
const User = require("../models/userModel.js");
const Event = require("../models/eventModel.js");
const ROperation = require("../models/rescueOperationModel.js");
const { fetchNearest } = require("../utils/location");
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

    await Agency.findByIdAndUpdate(req.user.id, { $set: { onGoingRescueOperation: rescueOps._id } });

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
      rescueOpsId: null,
    };
    if (agency.onGoingRescueOperation !== null) {
      response = {
        isRescueOperationOnGoing: true,
        rescueOpsId: agency.onGoingRescueOperation,
      };
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(`Error fetching onGoingRescueOperation status: ${error}`);
    return res.status(500).json({ message: "Error fetching onGoingRescueOperation status" });
  }
};

const agencyOnInitialConnect = async (req, res) => {
  const { lat, lng } = req.params;
  try {
    // Fetch nearby users if the user is an agency
    let users = [];
    if (req.user.isAgency) {
      const nearbyUsers = await fetchNearest(User, [parseFloat(lng), parseFloat(lat)]);

      users = nearbyUsers
        .filter((user) => user.socketId && user._id.toString() !== req.user.id.toString()) // Filter out own user's data
        .map((user) => {
          return {
            lng: user.lastLocation.coordinates[0],
            lat: user.lastLocation.coordinates[1],
            userId: user._id,
            userName: user.name,
            phoneNumber: user.phoneNumber,
          };
        });
    }

    // Fetch nearby agencies
    const nearbyAgencies = await fetchNearest(Agency, [parseFloat(lng), parseFloat(lat)]);

    const populatedAgencies = await Agency.populate(nearbyAgencies, { path: "onGoingRescueOperation" });

    const agencies = populatedAgencies
      .filter((agency) => agency.socketId && agency._id.toString() !== req.user.id.toString()) // Filter out own user's data
      .map((agency) => {
        return {
          lng: agency.lastLocation.coordinates[0],
          lat: agency.lastLocation.coordinates[1],
          agencyId: agency._id,
          agencyName: agency.name,
          phoneNumber: agency.phone,
          representativeName: agency.representativeName,
          rescueOpsName: agency.onGoingRescueOperation ? agency.onGoingRescueOperation.name : null,
          rescueOpsDescription: agency.onGoingRescueOperation ? agency.onGoingRescueOperation.description : null,
          rescueTeamSize: agency.onGoingRescueOperation ? agency.onGoingRescueOperation.rescueTeamSize : null,
        };
      });
    console.log(`Initially connected user ${req.user.id} and the data is ${JSON.stringify(agencies)}\n`);

    return res.status(200).json({ agencies, users });
  } catch (error) {
    console.error(`Error agencyOnInitialConnect: ${error}`);
    return res.status(500).json({ message: "Error agencyOnInitialConnect" });
  }
};

const rescueMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({});
  } catch (error) {
    console.error(`Error fetching onGoingRescueOperation status: ${error}`);
    return res.status(500).json({ message: "Error fetching onGoingRescueOperation status" });
  }
};

module.exports = { startRescueOps, deleteRescueOps, stopRescueOps, isRescueOperationOnGoing, agencyOnInitialConnect };
