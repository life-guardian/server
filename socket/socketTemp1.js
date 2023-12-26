// const { Server } = require("socket.io");

// const MAX_DISTANCE = 5;

// const socketIO = (server) => {
//   const io = new Server(server);

//   const users = {};
//   const agencies = {};

//   const broadcastToNearbyUsers = (socketId, location) => {
//     const { latitude, longitude } = location;

//     Object.keys(users).forEach((otherSocketId) => {
//       if (otherSocketId !== socketId) {
//         const otherUser = users[otherSocketId];
//         const distance = calculateDistance(
//           latitude,
//           longitude,
//           otherUser.location.latitude,
//           otherUser.location.longitude
//         );

//         if (distance <= MAX_DISTANCE) {
//           otherUser.socket.emit("userLocationUpdate", { socketId, location });
//         }
//       }
//     });
//   };

//   const broadcastToNearbyAgencies = (socketId, location) => {
//     const { latitude, longitude } = location;

//     Object.keys(agencies).forEach((otherSocketId) => {
//       if (otherSocketId !== socketId) {
//         const otherAgency = agencies[otherSocketId];
//         const distance = calculateDistance(
//           latitude,
//           longitude,
//           otherAgency.location.latitude,
//           otherAgency.location.longitude
//         );

//         if (distance <= MAX_DISTANCE) {
//           otherAgency.socket.emit("agencyLocationUpdate", {
//             socketId,
//             location,
//           });
//         }
//       }
//     });
//   };

//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371; // Radius of the Earth in kilometers
//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(deg2rad(lat1)) *
//         Math.cos(deg2rad(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c; // Distance in kilometers

//     return distance;
//   };

//   const deg2rad = (deg) => deg * (Math.PI / 180);

//   io.on("connection", (socket) => {
//     const socketId = socket.id;
//     users[socketId] = { socket, location: { latitude: 0, longitude: 0 } };
//     agencies[socketId] = { socket, location: { latitude: 0, longitude: 0 } };

//     socket.on("updateAgencyLocation", (location) => {
//       agencies[socketId].location = location;
//       broadcastToNearbyUsers(socketId, location);
//       broadcastToNearbyAgencies(socketId, location);
//     });

//     socket.on("updateUserLocation", (location) => {
//       users[socketId].location = location;
//       broadcastToNearbyAgencies(socketId, location);
//     });

//     socket.on("disconnect", () => {
//       delete users[socketId];
//       delete agencies[socketId];
//     });
//   });
// };

// module.exports = socketIO;
