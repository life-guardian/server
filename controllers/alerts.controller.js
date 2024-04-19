const mongoose = require("mongoose");
const moment = require("moment");
const Alert = require("../models/alertModel.js");
const User = require("../models/userModel.js");
const Agency = require("../models/agencyModel.js");
const { usersInRangeOfLocation, checkAndUpdateExistingAlert } = require("../utils/location.js");
const sendMail = require("../utils/sendEmail.js");
const sendSMS = require("../utils/sendSMS.js");

// agency
const sendAlert = async (req, res) => {
  //my approach is i am finding the users whose lastLocation is in 20kms of the radius from the location point
  //and then i am creating the alert and pushing its _id in receivedAlerts field of user

  try {
    // locationCoordinates is an array field with Longitude and latitude
    const { locationCoordinates, alertName, alertSeverity, alertForDate, alertDescription } = req.body;

    const response = await usersInRangeOfLocation(locationCoordinates, 20);
    const nearbyUsers = response.data;
    const userIDs = nearbyUsers.map((user) => user._id);

    if (!response.success) {
      return res.status(500).json({ message: "Error in finding nearby users" });
    }

    const alertLocation = {
      type: "Point",
      coordinates: [parseFloat(locationCoordinates[0]), parseFloat(locationCoordinates[1])],
    };

    const createdAlert = await Alert.create({
      alertName,
      alertSeverity,
      alertForDate,
      alertLocation,
      agencyId: req.user.id,
      alertDescription,
      receivers: userIDs,
    });

    //pushes alert id in receivedAlerts field of each user
    await User.updateMany({ _id: { $in: userIDs } }, { $push: { receivedAlerts: createdAlert._id } }, { multi: true });

    const agency = await Agency.findById(req.user.id);

    const userEmails = nearbyUsers.map((user) => user.email);
    const userPhoneNumbers = nearbyUsers.map((user) => user.phoneNumber);
    const formattedAlertDate = moment(alertForDate).format("DD-MMM-YYYY");
    const subject = `ALERT from LifeGuardian`;
    const content = `
    <b>Hello,</b>
    <p style="color:tomato; font-size : 15px;">An alert has been issued in your area.</p>
    <b><strong style="color: #333333;">Alert Name:</strong> ${alertName}</b><br>
    <b><strong style="color: #333333;">Alert Severity:</strong> ${alertSeverity}</b><br>
    <b><strong style="color: #333333;">Alert Date:</strong> ${formattedAlertDate}</b><br>
    <b><strong style="color: #333333;">Alerting agency:</strong> ${agency.name}</b><br>
    <b><strong style="color: #333333;">Alert Description:</strong> ${alertDescription}</b><br>
    <p>Stay safe!</p>
    `;

    if (userEmails.length > 0) {
      const isEmailSent = await sendMail(userEmails, subject, content);
      // if (isEmailSent) {
      //   console.log("Emails sent successfull");
      // }
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
  const { latitude, longitude } = req.params;

  try {
    const result = await checkAndUpdateExistingAlert([longitude, latitude], 20, req.user.id);

    if (!result.success) {
      console.log("Error in checkAndUpdateExistingAlert");
    }

    const user = await User.findById(req.user.id).populate({
      path: "receivedAlerts",
      populate: {
        path: "agencyId",
        model: "Agency",
      },
      options: { sort: { alertForDate: 1 } }, // Sort receivedAlerts by alertForDate in ascending order
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = user.receivedAlerts.map((alert) => ({
      alertId: alert._id,
      alertName: alert.alertName,
      alertLocation: alert.alertLocation.coordinates,
      alertForDate: alert.alertForDate,
      alertSeverity: alert.alertSeverity,
      agencyName: alert.agencyId.name,
      alertDescription: alert.alertDescription,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error(`Error in fetching received alerts: ${error}`);
    return res.status(500).json({ message: "Error in fetching received alerts" });
  }
};

//agency
const deleteAlert = async (req, res) => {
  const alertId = req.params.alertId;

  try {
    const deletedAlert = await Alert.findOneAndDelete({
      _id: alertId,
      agencyId: req.user.id,
    });

    if (!deletedAlert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    const receivers = deletedAlert.receivers;

    await User.updateMany({ _id: { $in: receivers } }, { $pull: { receivedAlerts: alertId } });

    res.status(200).json({ message: "Alert deleted successfully" });
  } catch (error) {
    console.error(`Error in deleting alert: ${error}`);
    return res.status(500).json({ message: "Error in deleting alert" });
  }
};

const searchAlert = async (req, res) => {
  let query = {};
  const searchText = req.body.searchText.trim();
  if (searchText) {
    query = {
      $or: [{ alertName: { $regex: searchText, $options: "i" } }],
    };
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;

  try {
    const count = await Alert.countDocuments(query);
    const totalPages = Math.ceil(count / limit);

    const alerts = await Alert.find(query)
      .select("_id alertName alertLocation alertForDate alertSeverity agencyName alertDescription")
      .skip(skip)
      .limit(limit);

    res.status(200).json({ totalPages, currentPage: page, alerts });
  } catch (error) {
    console.error(`Error finding agency: ${error}`);
    return res.status(500).json({ message: "Error finding agency" });
  }
};

module.exports = {
  sendAlert,
  showReceivedAlerts,
  deleteAlert,
  searchAlert,
};
