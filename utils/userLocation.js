const mongoose = require("mongoose");
const User = require("../models/userModel");

const usersInRangeOfLocation = async (locationCoordinates) => {
  try {
    // Convert 10 kilometers to miles as the query accepts distance in miles
    const radiusInMiles = 10 / 1.60934;
    
    //longitude first and lattitude second
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


const updateUsersLastLocation = async(userId, newCoordinates)=>{

    try {
        const user = await User.findById(userId);
        if (!user) {
          console.log('User not found');
          return;
        }
        
        //longitude first and lattitude second
        user.lastLocation = {
          type: 'Point',
          coordinates: [parseFloat(newCoordinates[0]), parseFloat(newCoordinates[1])],
        };
        user.lastLocationUpdatedAt = new Date();
    
        await user.save();
        console.log('users last location updated');
        return { success: true, message: "users last location updated" };
      } catch (error) {
        console.log("Error updating users last location:  "+ error);
        return { success: false, message: "Error updating users last location" };
      }

}


module.exports = {usersInRangeOfLocation, updateUsersLastLocation};