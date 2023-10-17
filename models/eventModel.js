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

        agencyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agency",
            required: true,
        },

        //registrations done for this event
        registrations: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "EventRegistration"
        }
    },
    {
        timestamps: true,
    }
);

const Event = new mongoose.model("Event", eventSchema);

module.exports = Event;
