const _ = require("lodash");
const User = require("../models/userModel");
const Agency = require("../models/agencyModel");
const { fetchNearest } = require("../utils/location");

const THROTTLE_INTERVAL = 5000; //5s

const handleOnConnection = async (socket) => {
  console.log("User connected: " + socket.id);
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

  await User.findOneAndUpdate(
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

  if (socketIds.length > 0) {
    socket.broadcast.to(socketIds).emit("userLocationUpdate", locationPayload);
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

    await Agency.findOneAndUpdate(
      { _id: socket.user.id },
      { $set: { lastLocation: agencyLocation } }
    );

    const nearbyAgencies = await fetchNearest(Agency, [
      parseFloat(locationPayload.lng),
      parseFloat(locationPayload.lat),
    ]);

    console.log(nearbyAgencies);

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

    if (agencySocketIds.length > 0) {
      socket.broadcast
        .to(agencySocketIds)
        .emit("agencyLocationUpdate", locationPayload);
    }

    if (userSocketIds.length > 0) {
      socket.broadcast
        .to(userSocketIds)
        .emit("agencyLocationUpdate", locationPayload);
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
    console.log(`${socket.id} disconnected`);
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
