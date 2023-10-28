const mongoose = require("mongoose");

const rescueOperationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    hostAgency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },

    agencyLocation: {
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

    rescueTeamSize: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
rescueOperationSchema.index({ agencyLocation: "2dsphere" });

const ROperation = mongoose.model("ROperation", rescueOperationSchema);

module.exports = ROperation;
