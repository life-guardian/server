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

    onGoingRescueOperation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ROperation",
      default: null
    },

    socketId: {
      type: String,
      default: null
    },

    lastLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
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
