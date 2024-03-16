const { Server } = require("socket.io");
const socketAuth = require("../middlewares/socketAuth");
const {
  handleOnConnection,
  handleUserLocationUpdate,
  handleAgencyLocationUpdate,
  handleDisconnect,
} = require("./socketFunctions");

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
      const updateId = Date.now(); // Generate unique identifier
      await handleUserLocationUpdate(socket, locationPayload);
      console.log(`User update: ${socket.id} and update id: ${updateId}`);
    });

    socket.on("agencyLocationUpdate", async (locationPayload) => {
      const updateId = Date.now(); // Generate unique identifier
      console.log(`received update of: ${socket.id} and update id: ${updateId}`);
      await handleAgencyLocationUpdate(socket, locationPayload);
      console.log(`agency update: ${socket.id} and update id: ${updateId}`);
    });

    socket.on("disconnect", async () => {
      console.log(`disconnected: ${socket.id}`);
      await handleDisconnect(socket);
    });
  });
};

module.exports = socketIO;
