const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    alertName: {
      type: String,
      required: true,
    },

    alertSeverity: {
      type: String,
      enum: ["high", "medium", "low"],
      required: true,
    },

    alertLocation: {
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

    alertForDate: {
      type: Date,
      required: true,
    },

    agencyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
alertSchema.index({ alertLocation: "2dsphere" });

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;
