const _ = require("lodash");
const User = require("../models/userModel");
const Agency = require("../models/agencyModel");
const ROperation = require("../models/rescueOperationModel");
const { fetchNearest } = require("../utils/location");

const THROTTLE_INTERVAL = 5000; //5s

const handleOnConnection = async (socket) => {
  // console.log("User connected: " + socket.id);
  if (socket.user.isAgency) {
    await Agency.findOneAndUpdate(
      { _id: socket.user.id },
      { $set: { socketId: socket.id } }
    );
  } else {
    await User.findOneAndUpdate(
      { _id: socket.user.id },
      { $set: { socketId: socket.id } }
    );
  }
};

// Throttle the userLocationUpdate event
const handleUserLocationUpdate = _.throttle(async (socket, locationPayload) => {
  const userLocation = {
    type: "Point",
    coordinates: [
      parseFloat(locationPayload.lng),
      parseFloat(locationPayload.lat),
    ],
  };
  console.log(`User location : ${JSON.stringify(userLocation)}`);

  const user = await User.findOneAndUpdate(
    { _id: socket.user.id },
    { $set: { lastLocation: userLocation } }
  );

  const nearbyAgencies = await fetchNearest(Agency, [
    parseFloat(locationPayload.lng),
    parseFloat(locationPayload.lat),
  ]);

  const socketIds = nearbyAgencies
    .filter((agency) => agency.socketId)
    .map((agency) => agency.socketId);

  const responseData = {
    ...locationPayload, 
    userId: socket.user.id,
    userName: user.name,
    phoneNumber: user.phoneNumber
  }

  if (socketIds.length > 0) {
    socket.broadcast.to(socketIds).emit("userLocationUpdate", responseData);
  }
}, THROTTLE_INTERVAL);

// Throttle the agencyLocationUpdate event
const handleAgencyLocationUpdate = _.throttle(
  async (socket, locationPayload) => {
    const agencyLocation = {
      type: "Point",
      coordinates: [
        parseFloat(locationPayload.lng),
        parseFloat(locationPayload.lat),
      ],
    };

    console.log(`Agency location : ${JSON.stringify(agencyLocation)}`);

    const updatedAgency = await Agency.findOneAndUpdate(
  { _id: socket.user.id },
  { $set: { lastLocation: agencyLocation } }
);

// perform a separate query to populate the field
const agency = await Agency.populate(updatedAgency, { path: "onGoingRescueOperation" });


    const nearbyAgencies = await fetchNearest(Agency, [
      parseFloat(locationPayload.lng),
      parseFloat(locationPayload.lat),
    ]);

    // console.log(nearbyAgencies);

    const nearbyusers = await fetchNearest(User, [
      parseFloat(locationPayload.lng),
      parseFloat(locationPayload.lat),
    ]);

    const agencySocketIds = nearbyAgencies
      .filter((agency) => agency.socketId)
      .map((agency) => agency.socketId);

    const userSocketIds = nearbyusers
      .filter((user) => user.socketId)
      .map((user) => user.socketId);

      const responseData = {
        ...locationPayload, 
        agencyId: socket.user.id,
        agencyName: agency.name,
        phoneNumber: agency.phone,
        representativeName: agency.representativeName,
        rescueOpsName: agency.onGoingRescueOperation.name,
        rescueOpsDescription: agency.onGoingRescueOperation.description,
        rescueTeamSize: agency.onGoingRescueOperation.rescueTeamSize,
      }

    if (agencySocketIds.length > 0) {
      socket.broadcast
        .to(agencySocketIds)
        .emit("agencyLocationUpdate", responseData);
    }

    if (userSocketIds.length > 0) {
      socket.broadcast
        .to(userSocketIds)
        .emit("agencyLocationUpdate", responseData);
    }
  },
  THROTTLE_INTERVAL
);

const handleDisconnect = async (socket) => {
  try {
    if (socket.user.isAgency) {
      await Agency.findOneAndUpdate(
        { _id: socket.user.id },
        { $set: { socketId: null } }
      );
    } else {
      await User.findOneAndUpdate(
        { _id: socket.user.id },
        { $set: { socketId: null } }
      );
    }

    socket.broadcast.emit("disconnected", socket.id);
    // console.log(`${socket.id} disconnected`);
  } catch (error) {
    console.error("Error handling disconnect:", error);
  }
};

module.exports = {
  handleOnConnection,
  handleUserLocationUpdate,
  handleAgencyLocationUpdate,
  handleDisconnect,
};
