const User = require("../models/userModel");

const usersInRangeOfLocation = async (locationCoordinates) => {
  try {
    // Convert 10 kilometers to miles as the query accepts distance in miles
    const radiusInMiles = 10 / 1.60934;
    
    const options = {
      lastLocation: {
        $geoWithin: {
          $centerSphere: [[parseFloat(locationCoordinates[0]), parseFloat(locationCoordinates[1])], radiusInMiles / 3963.2] //dividing by 3963.2 to convert the distance from miles to radians
        }
      }
    };

    const users = await User.find(options);

    return { success: true, data: users };
  } catch (error) {
    console.log("Error in finding usersInRangeOfLocation: " + error);
    return { success: false, data: null };
  }
};

module.exports = {
  usersInRangeOfLocation,
};
