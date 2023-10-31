const mongoose = require("mongoose");
const Alert = require("../models/alertModel.js");
const User = require("../models/userModel.js");
const {
  updateUsersLastLocation,
  usersInRangeOfLocation,
} = require("../utils/userLocation.js");

// agency
const sendAlert = async (req, res) => {
  //my approach is i am finding the users whose lastLocation is in 20kms of the radius from the location point
  //and then i am creating the alert and pushing its _id in receivedAlerts field of user

  try {
    // locationCoordinates is an array field with Longitude and latitude
    const { locationCoordinates, alertName, alertSeverity, alertForDate } =
      req.body;

    const result = await usersInRangeOfLocation(locationCoordinates);

    if (!result.success) {
      return res.status(400).json({ message: "Error in finding nearby users" });
    }

    const alertLocation = {
      type: "Point",
      coordinates: [
        parseFloat(locationCoordinates[0]),
        parseFloat(locationCoordinates[1]),
      ],
    };

    const createdAlert = await Alert.create({
      alertName,
      alertSeverity,
      alertForDate,
      alertLocation,
      agencyId: req.user.id,
    });

    const users = result.data;

    //extract _ids of users from usersInRangeOfLocation
    const userIDs = users.map((user) => user._id);

    console.log("Alerts sent to :\n" + users);

    //pushes alert id in receivedAlerts field of each user
    await User.updateMany(
      { _id: { $in: userIDs } },
      { $push: { receivedAlerts: createdAlert._id } },
      { multi: true }
    );

    return res.status(200).json({ message: "Alert sent successfully" });
  } catch (error) {
    console.error(`Error in sending alert: ${error}`);
    return res.status(500).json({ message: "Error in sending alert" });
  }
};

//user
const showReceivedAlerts = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await User.findById(userId).populate({
      path: "receivedAlerts",
      populate: {
        path: "agencyId",
        model: "Agency",
      },
    });

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = data.receivedAlerts.map((alert) => ({
      alertName: alert.alertName,
      alertLocation: alert.alertLocation.coordinates,
      alertForDate: alert.alertForDate,
      alertSeverity: alert.alertSeverity,
      agencyName: alert.agencyId.name,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error(`Error in fetching received alerts: ${error}`);
    return res
      .status(500)
      .json({ message: "Error in fetching received alerts" });
  }
};

module.exports = {
  sendAlert,
  showReceivedAlerts,
};
