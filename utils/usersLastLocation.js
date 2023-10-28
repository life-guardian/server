const User = require("../models/userModel");

const updateUsersLastLocation = async(userId, newCoordinates)=>{

    try {
        const user = await User.findById(userId);
        if (!user) {
          console.log('User not found');
          return;
        }
    
        user.lastLocation = {
          type: 'Point',
          coordinates: [parseFloat(newCoordinates[0]), parseFloat(newCoordinates[1])],
        };
        user.lastLocationUpdatedAt = new Date();
    
        await user.save();
        console.log('User last location updated successfully');
        return { success: true, message: "User last location updated successfully" };
      } catch (error) {
        console.log("Error updating user last location:  "+ error);
        return { success: false, message: "Error updating user last location" };
      }

}


module.exports = {updateUsersLastLocation};