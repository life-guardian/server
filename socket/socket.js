const { Server } = require("socket.io");
const socketAuth = require("../middlewares/socketAuth");
const {
  handleOnConnection,
  handleOnInitialConnect,
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

    socket.on("initialConnect", async (locationPayload) => {
      await handleOnInitialConnect(socket, locationPayload);
      console.log(`Initial connect: ${socket.id}`);
    });

    socket.on("userLocationUpdate", async (locationPayload) => {
      const updateId = Date.now(); // Generate unique identifier
      await handleUserLocationUpdate(socket, locationPayload, updateId);
      // console.log(`User update: ${socket.id} and update id: ${updateId}`);
    });

    socket.on("agencyLocationUpdate", async (locationPayload) => {
      const updateId = Date.now(); // Generate unique identifier
      // console.log(`received update of -: ${socket.id} and update id: ${updateId}`);
      await handleAgencyLocationUpdate(socket, locationPayload, updateId);
      // console.log(`agency might updated: ${socket.id} and update id: ${updateId}`);
    });

    socket.on("disconnect", async () => {
      // console.log(`disconnected: ${socket.id}`);
      await handleDisconnect(socket);
    });
  });
};

module.exports = socketIO;
