const mongoose = require("mongoose");
const User = require("../models/userModel");
const Alert = require("../models/alertModel");

//check and update receivedAlerts of user, if there is any alert already issued for the area in which users last updated location is
const checkAlertForLocation = async (
  locationCoordinates,
  rangeInKm,
  userId
) => {
  try {
    // Convert kilometers to miles, as the query accepts distance in miles
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
    user.receivedAlerts.push(alerts);
    await user.save();

    return { success: true };
  } catch (error) {
    console.log(
      "Error in updating alerts for the user's last updated location: " + error
    );
    return { success: false };
  }
};

module.exports = checkAlertForLocation;
