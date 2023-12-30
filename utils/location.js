const User = require("../models/userModel");
const Alert = require("../models/alertModel");

const usersInRangeOfLocation = async (locationCoordinates, rangeInKm) => {
  try {
    // Converting kilometers to miles as the query accepts distance in miles
    const radiusInMiles = rangeInKm / 1.60934;

    //longitude first and lattitude second
    const options = {
      lastLocation: {
        $geoWithin: {
          $centerSphere: [
            [
              parseFloat(locationCoordinates[0]),
              parseFloat(locationCoordinates[1]),
            ],
            radiusInMiles / 3963.2,
          ], //dividing by 3963.2 to convert the distance from miles to radians
        },
      },
    };

    const users = await User.find(options);

    return { success: true, data: users };
  } catch (error) {
    console.log("Error in finding usersInRangeOfLocation: " + error);
    return { success: false, data: null };
  }
};

const updateUsersLastLocation = async (userId, newCoordinates) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found to update its last location");
      return;
    }

    //longitude first and lattitude second
    user.lastLocation = {
      type: "Point",
      coordinates: [
        parseFloat(newCoordinates[0]),
        parseFloat(newCoordinates[1]),
      ],
    };
    user.lastLocationUpdatedAt = new Date();

    await user.save();
    return { success: true, message: "users last location updated" };
  } catch (error) {
    console.log("Error updating users last location:  " + error);
    return { success: false, message: "Error updating users last location" };
  }
};


//check if there is any alert already issued for the area 
const checkAndUpdateAlertForLocation = async (
  locationCoordinates,
  rangeInKm,
  userId
) => {
  try {
    // Converting kilometers to miles, as the query accepts distance in miles
    const radiusInMiles = rangeInKm / 1.60934;

    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      return { success: false };
    }

    const alreadyReceivedAlerts = user.receivedAlerts;

    const options = {
      _id: { $nin: alreadyReceivedAlerts }, // Exclude alerts with IDs present in alreadyReceivedAlerts
      alertLocation: {
        $geoWithin: {
          $centerSphere: [
            [
              parseFloat(locationCoordinates[0]),
              parseFloat(locationCoordinates[1]),
            ],
            radiusInMiles / 3963.2,
          ],
        },
      },
    };

    // Find alerts within the specified area, excluding those already received
    const alerts = await Alert.find(options);

    user.receivedAlerts.push(...alerts.map(alert => alert._id));
    await user.save();

    return { success: true };
  } catch (error) {
    console.log(
      "Error in updating alerts for the user's last updated location: " + error
    );
    return { success: false };
  }
};


const fetchNearest = async (Model, coordinates) => {
  const MAX_DISTANCE = 5; //km
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
};

module.exports = {
  usersInRangeOfLocation,
  updateUsersLastLocation,
  checkAndUpdateAlertForLocation,
  fetchNearest,
};
