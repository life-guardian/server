const _ = require("lodash");
const User = require("../models/userModel");
const Agency = require("../models/agencyModel");
const ROperation = require("../models/rescueOperationModel");
const { fetchNearest } = require("../utils/location");

const THROTTLE_INTERVAL = 2000; //2s

const handleOnConnection = async (socket) => {
  // console.log("User connected: " + socket.id);
  if (socket.user.isAgency) {
    await Agency.findOneAndUpdate({ _id: socket.user.id }, { $set: { socketId: socket.id } });
  } else {
    await User.findOneAndUpdate({ _id: socket.user.id }, { $set: { socketId: socket.id } });
  }
};

// Throttle the userLocationUpdate event
const handleUserLocationUpdate = _.throttle(async (socket, locationPayload) => {
  if (socket.user.isAgency) {
    socket.emit("userLocationUpdate", {
      status: false,
      message: "You are not authorized as user",
    });
    return;
  }
  const userLocation = {
    type: "Point",
    coordinates: [parseFloat(locationPayload.lng), parseFloat(locationPayload.lat)],
  };

  const user = await User.findOneAndUpdate(
    { _id: socket.user.id },
    { $set: { lastLocation: userLocation } },
    { new: true }
  );

  if (!user) {
    socket.emit("userLocationUpdate", {
      status: false,
      message: "User not found",
    });
    return;
  }

  const nearbyAgencies = await fetchNearest(Agency, [parseFloat(locationPayload.lng), parseFloat(locationPayload.lat)]);

  const socketIds = nearbyAgencies.filter((agency) => agency.socketId).map((agency) => agency.socketId);

  const responseData = {
    ...locationPayload,
    userId: socket.user.id,
    userName: user.name,
    phoneNumber: user.phoneNumber,
  };

  if (socketIds.length > 0) {
    socket.broadcast.to(socketIds).emit("userLocationUpdate", responseData);
  }
}, THROTTLE_INTERVAL);

// Throttle the agencyLocationUpdate event
const handleAgencyLocationUpdate = _.throttle(async (socket, locationPayload, updateId) => {
  if (!socket.user.isAgency) {
    socket.emit("agencyLocationUpdate", {
      status: false,
      message: "You are not authorized as agency",
    });
    return;
  }

  const agencyLocation = {
    type: "Point",
    coordinates: [parseFloat(locationPayload.lng), parseFloat(locationPayload.lat)],
  };

  const result = await Agency.findOneAndUpdate({ _id: socket.user.id }, { $set: { lastLocation: agencyLocation } });
  if (!result) {
    socket.emit("agencyLocationUpdate", {
      status: false,
      message: "You as agency not found",
    });
    return;
  }
  const agencyData = await Agency.findById(socket.user.id).populate("onGoingRescueOperation");

  const nearbyAgencies = await fetchNearest(Agency, [parseFloat(locationPayload.lng), parseFloat(locationPayload.lat)]);

  // console.log(nearbyAgencies);

  const nearbyusers = await fetchNearest(User, [parseFloat(locationPayload.lng), parseFloat(locationPayload.lat)]);

  const agencySocketIds = nearbyAgencies.filter((agency) => agency.socketId).map((agency) => agency.socketId);

  const userSocketIds = nearbyusers.filter((user) => user.socketId).map((user) => user.socketId);

  const responseData = {
    ...locationPayload,
    agencyId: socket.user.id,
    agencyName: agencyData.name,
    phoneNumber: agencyData.phone,
    representativeName: agencyData.representativeName,
    rescueOpsName: agencyData.onGoingRescueOperation ? agencyData.onGoingRescueOperation.name : null,
    rescueOpsDescription: agencyData.onGoingRescueOperation ? agencyData.onGoingRescueOperation.description : null,
    rescueTeamSize: agencyData.onGoingRescueOperation ? agencyData.onGoingRescueOperation.rescueTeamSize : null,
  };

  if (agencySocketIds.length > 0) {
    socket.broadcast.to(agencySocketIds).emit("agencyLocationUpdate", responseData);
  }

  if (userSocketIds.length > 0) {
    socket.broadcast.to(userSocketIds).emit("agencyLocationUpdate", responseData);
  }
  console.log(`Processed update of : ${socket.id} and update id: ${updateId}`);
}, THROTTLE_INTERVAL);

const handleDisconnect = async (socket) => {
  try {
    if (socket.user.isAgency) {
      await Agency.findOneAndUpdate({ _id: socket.user.id }, { $set: { socketId: null } });
    } else {
      await User.findOneAndUpdate({ _id: socket.user.id }, { $set: { socketId: null } });
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
