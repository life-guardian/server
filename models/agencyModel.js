const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: Number,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    representativeName: {
      type: String,
      required: true,
    },

    socketId: {
      type: String,
      default: null
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

  },
  {
    timestamps: true,
  }
);

agencySchema.index({ lastLocation: "2dsphere" });

const Agency = new mongoose.model("Agency", agencySchema);

module.exports = Agency;
