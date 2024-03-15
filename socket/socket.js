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
    console.log(`Connection established : ${socket.id}`);
    
    await handleOnConnection(socket);

    console.log(`Connection established and connection migth handled: ${socket.id}`);

    socket.on("userLocationUpdate", async (locationPayload) => {
      
      console.log(`User location update: ${socket.id}`);
      await handleUserLocationUpdate(socket, locationPayload);
      
      console.log(`User update and migth handled: ${socket.id}`);
    });

    socket.on("agencyLocationUpdate", async (locationPayload) => {
      console.log(`agency location update: ${socket.id}`);
      await handleAgencyLocationUpdate(socket, locationPayload);
      console.log(`agency update and migth handled: ${socket.id}`);
    });

    socket.on("disconnect", async () => {
      console.log(`disconnected: ${socket.id}`);
      await handleDisconnect(socket);
    });
  });
};

module.exports = socketIO;
