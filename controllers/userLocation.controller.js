const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const { updateUsersLastLocation } = require("../utils/userLocation.js");

const updateLastLocationUser = async (req, res) => {
  try {
    //location coordinates is array field with Longitude and lattitude
    const { locationCoordinates } = req.body;
    
    const result = await updateUsersLastLocation(req.user.id, locationCoordinates);
    if(!result.success){
        return res.status(400).json({message: result.message});
    }
    
    return res.status(200).json({message: result.message});
  } catch (error) {
    console.error(`Error in updating users last location`);
    return res.status(500).json({ message: "Error in updating users last location" });
  }
};

module.exports = {
    updateLastLocationUser
};
