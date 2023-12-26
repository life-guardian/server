const { Server } = require("socket.io");
const socketAuth = require("../middlewares/socketAuth");
const {handleOnConnection, handleUserLocationUpdate, handleAgencyLocationUpdate, handleDisconnect} = require('./socketFunctions');

const socketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    socketAuth(socket, next);
  });

  io.on("connection", async (socket) => {
    await handleOnConnection(socket);


    socket.on("userLocationUpdate", async (locationPayload) => {
      await handleUserLocationUpdate(socket, locationPayload);
    });

    socket.on("agencyLocationUpdate", async (locationPayload) => {
      await handleAgencyLocationUpdate(socket, locationPayload);
    });

    socket.on("disconnect", async () => {
      await handleDisconnect(socket);
    });
  });
};

module.exports = socketIO;
