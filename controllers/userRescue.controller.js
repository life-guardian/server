const mongoose = require("mongoose");
const User = require("../models/userModel.js");

const rescueMe = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $set: { "rescue.isInDanger": true, "rescue.reason": req.body.rescueReason },
    });

    res.status(200).json({ message: "Rescue me!" });
  } catch (error) {
    console.error(`Error changing rescueme status: ${error}`);
    return res.status(500).json({ message: "Error changing rescueme status" });
  }
};

//first check before connecting calling rescueMe api if the user is already indanger and if his app was closed and now he has reopened it then check if the rescueMealreadystarted and if not then call the rescueMe api and connect to socket else directly connectToSocket
const isAlreadyRescueMeStarted = async (req, res) => {
  try {
    const user = await User.findbyId(req.user.id);
    return res.status(200).json({ userAlreadyInDanger: user.rescue.isInDanger });
  } catch (error) {
    console.error(`Error fetching isAlreadyRescueMeStarted: ${error}`);
    return res.status(500).json({ message: "Error fetching isAlreadyRescueMeStarted" });
  }
};

//stop after rescueMe
const stopUserRescue = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $set: { "rescue.isInDanger": false, "rescue.reason": null },
    });

    res.status(200).json({ message: "Stopped user rescue" });
  } catch (error) {
    console.error(`Error changing stop rescueme status: ${error}`);
    return res.status(500).json({ message: "Error changing stop rescueme status" });
  }
};

module.exports = {
  rescueMe,
  stopUserRescue,
  isAlreadyRescueMeStarted,
};
