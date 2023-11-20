const io = require('socket.io')();

const users = {};

io.on('connection', (socket) => {
  // When a user connects, store their socket ID
  const userId = socket.id;
  users[userId] = { socket, location: { latitude: 0, longitude: 0 } };

  // When a user updates their location
  socket.on('updateLocation', (location) => {
    users[userId].location = location;

    // Broadcast the location update to nearby users
    broadcastToNearbyUsers(userId, location);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    delete users[userId];
  });
});

const broadcastToNearbyUsers = (userId, location) => {
  const { latitude, longitude } = location;
  const maxDistance = 5; // 5 km

  Object.keys(users).forEach((otherUserId) => {
    if (otherUserId !== userId) {
      const otherUser = users[otherUserId];
      const distance = calculateDistance(
        latitude,
        longitude,
        otherUser.location.latitude,
        otherUser.location.longitude
      );

      if (distance <= maxDistance) {
        otherUser.socket.emit('locationUpdate', { userId, location });
      }
    }
  });
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);


  //this is haversine formula to find distance between two points on perfectly spherical earth

  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers


  //we can use vincenty's formulae for more precision over large distances


  return distance;
};

const deg2rad = (deg) => deg * (Math.PI / 180);

io.listen(3000, () => {
  console.log('Socket.io server listening on port 3000');
});
