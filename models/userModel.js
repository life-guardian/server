const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    lastLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    lastLocationUpdatedAt: {
      type: Date,
      default: NULL
    }

  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
User.index({ lastLocation: "2dsphere" });

const User = new mongoose.model("User", userSchema);

module.exports = User;
