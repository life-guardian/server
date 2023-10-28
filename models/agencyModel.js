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
  },
  {
    timestamps: true,
  }
);

const Agency = new mongoose.model("Agency", agencySchema);

module.exports = Agency;
