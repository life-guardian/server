// const app = require("express")();
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const turf = require('@turf/turf');
// const { Server } = require("socket.io");

// const MAX_DISTANCE = 5;


// const socketIO = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.use((socket, next) => {
//     try {
//       const authHeader =
//         socket.handshake.headers.authorization || socket.handshake.auth.token;
//       const token = authHeader && authHeader.split(" ")[1];
//       if (!token) {
//         return next(new Error("Missing JWT token"));
//       }
//       const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
//       socket.user = user;
//       next();
//     } catch (error) {
//       return next(new Error("Unauthorized"));
//     }
//   });

//   // Store connected users and roles (agency/user)
//   const users = new Map();

//   // Store user locations (keyed by user ID)
//   const locations = new Map();

//   // Define roles
//   const ROLE_USER = "user";
//   const ROLE_AGENCY = "agency";

//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);
//     function handleUserLocationUpdate(data) {
//       // Update user location in locations map
//       locations.set(socket.id, data);

//       // Broadcast location to nearby agencies (geofencing calculation)
//       const nearbyAgencies = getNearbyAgencies(data);
//       io.to(nearbyAgencies).emit("user_location", {
//         id: socket.id,
//         location: data,
//       });
//     }

//     function handleAgencyLocationUpdate(data) {
//       // Update agency location in locations map
//       locations.set(socket.id, data);

//       // Broadcast location to nearby users 
//       const nearbyUsers = getNearbyUsers(data);
//       io.to(nearbyUsers).emit("agency_location", {
//         id: socket.id,
//         location: data,
//       });

//       // Broadcast location to nearby agencies 
//       const nearbyAgencies = getNearbyAgencies(data);
//       io.to(nearbyAgencies).emit("user_location", {
//         id: socket.id,
//         location: data,
//       });
//     }

//     // Identify user type
//     let role = "user";
//     if (socket.user.isAgency) {
//       role = "agency";
//     }

//     users.set(socket.id, { id: socket.id, role });

//     // Listen for events based on role
//     if (role === ROLE_USER) {
//       // Listen for user location updates
//       socket.on("location_update", handleUserLocationUpdate);
//     } else if (role === ROLE_AGENCY) {
//       // Listen for agency location updates
//       socket.on("agency_location", handleAgencyLocationUpdate);
//     }

//     socket.on("disconnect", () => {
      
//       console.log(`${socket.id} disconnected`);
//     });
//   });
// };

// function getNearbyAgencies(data) {
//   const point = turf.point({ latitude: data.lat, longitude: data.lng });
//   const buffer = turf.buffer(point, MAX_DISTANCE * 1000, { units: 'meters' }); // Convert km to meters
//   const nearbyAgencies = [];

//   for (const [agencyId, agencyLocation] of locations.entries()) {
//     if (agencyId === socket.id) continue;

//     const agencyPoint = turf.point({ latitude: agencyLocation.lat, longitude: agencyLocation.lng });

//     if (turf.booleanWithin(agencyPoint, buffer)) {
//       nearbyAgencies.push(agencyId);
//     }
//   }

//   return nearbyAgencies;
// }

// function getNearbyUsers(data) {
//   const point = turf.point({ latitude: data.lat, longitude: data.lng });
//   const buffer = turf.buffer(point, MAX_DISTANCE * 1000, { units: 'meters' });
//   const nearbyUsers = [];

//   for (const [userId, userLocation] of locations.entries()) {
//     if (userId === socket.id) continue;

//     const userPoint = turf.point({ latitude: userLocation.lat, longitude: userLocation.lng });

//     if (turf.booleanWithin(userPoint, buffer) && userLocation.role === ROLE_USER) {
//       nearbyUsers.push(userId);
//     }
//   }

//   return nearbyUsers;
// }



// module.exports = socketIO;
