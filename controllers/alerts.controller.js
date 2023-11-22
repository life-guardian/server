const mongoose = require("mongoose");
const moment = require("moment")
const Alert = require("../models/alertModel.js");
const User = require("../models/userModel.js");
const Agency = require("../models/agencyModel.js");
const { usersInRangeOfLocation } = require("../utils/userLocation.js");
const sendMail = require("../utils/sendEmail.js");
const sendSMS = require("../utils/sendSMS.js");

// agency
const sendAlert = async (req, res) => {
  //my approach is i am finding the users whose lastLocation is in 20kms of the radius from the location point
  //and then i am creating the alert and pushing its _id in receivedAlerts field of user

  try {
    // locationCoordinates is an array field with Longitude and latitude
    const { locationCoordinates, alertName, alertSeverity, alertForDate } = req.body;

    const result = await usersInRangeOfLocation(locationCoordinates, 20);
    if (!result.success) {
      return res.status(500).json({ message: "Error in finding nearby users" });
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

    //pushes alert id in receivedAlerts field of each user
    await User.updateMany(
      { _id: { $in: userIDs } },
      { $push: { receivedAlerts: createdAlert._id } },
      { multi: true }
    );
    
    const agency = await Agency.findById(req.user.id);

    const userEmails = users.map((user) => user.email);
    const userPhoneNumbers = users.map((user) => user.phoneNumber);
    const formattedAlertDate = moment(alertForDate).format("DD-MMM-YYYY");
    const subject = `ALERT from LifeGuardian`;
    const content = `
    <b>Hello,</b>
    <p style="color:tomato; font-size : 15px;">An alert has been issued in your area.</p>
    <b><strong style="color: #333333;">Alert Name:</strong> ${alertName}</b><br>
    <b><strong style="color: #333333;">Alert Severity:</strong> ${alertSeverity}</b><br>
    <b><strong style="color: #333333;">Alert Date:</strong> ${formattedAlertDate}</b><br>
    <b><strong style="color: #333333;">Alerting agency:</strong> ${agency.name}</b><br>
    <p>Stay safe!</p>
    `;

    if (userEmails.length > 0) {

      const isEmailSent = await sendMail(userEmails, subject, content);
      if (isEmailSent) {
        console.log("Emails sent successfull");
      }
      const smsText = `ALERT! Name- ${alertName} severity- ${alertSeverity} date- ${formattedAlertDate} alerting agency- ${agency.name}`;
      await sendSMS(userPhoneNumbers, smsText);

    }

    return res.status(200).json({ message: `Alert sent to ${userIDs.length} users` });
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
