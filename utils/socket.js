const app = require("express")();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Agency = require("../models/agencyModel");
const _ = require("lodash");
const { Server } = require("socket.io");

const MAX_DISTANCE = 5;
const THROTTLE_INTERVAL = 5000; //5ms

async function fetchNearest(Model, coordinates) {
  try {
    const results = await Model.find({
      lastLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates,
          },
          $maxDistance: MAX_DISTANCE * 1000,
        },
      },
    }).exec();

    return results;
  } catch (err) {
    console.log(err);
    return new Error("Error finding nearest entities");
  }
}

const socketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    try {
      const authHeader =
        socket.handshake.headers.authorization || socket.handshake.auth.token;
      const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        return next(new Error("Missing JWT token"));
      }
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async (socket) => {
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

    // Throttle the userLocationUpdate event
    const throttledUserLocationUpdate = _.throttle(async (locationPayload) => {
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

      const nearbyAgencies = await fetchNearest("Agency", [
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

    socket.on("userLocationUpdate", (locationPayload) => {
      throttledUserLocationUpdate(locationPayload);
    });

    // Throttle the agencyLocationUpdate event
    const throttledAgencyLocationUpdate = _.throttle(
      async (locationPayload) => {
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
          socket.broadcast.to(agencySocketIds).emit("agencyLocationUpdate", locationPayload);
        }

        if (userSocketIds.length > 0) {
          socket.broadcast.to(userSocketIds).emit("agencyLocationUpdate", locationPayload);
        }
      },
      THROTTLE_INTERVAL
    );

    socket.on("agencyLocationUpdate", async (locationPayload) => {
      throttledAgencyLocationUpdate(locationPayload);
    });

    socket.on("disconnect", async () => {
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
    });
  });
};

module.exports = socketIO;
