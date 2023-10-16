const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        eventName: {
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

        location: {
            latitude: {
                type: String,
                required: true
            },
            longitude: {
                type: String,
                required: true
            },
        },

        eventDate: {
            type: Date,
            required: true,
        },

        eventType: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Event = new mongoose.model("Event", eventSchema);

module.exports = Event;
