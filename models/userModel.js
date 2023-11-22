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
        enum: ["Point"]
      },
      coordinates: {
        type: [Number]
      },
    },

    lastLocationUpdatedAt: {
      type: Date,
      default: null
    },

    receivedAlerts: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Alert",
    },

    registeredEvents: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Event",
    }

  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
userSchema.index({ lastLocation: "2dsphere" });

const User = new mongoose.model("User", userSchema);

module.exports = User;
