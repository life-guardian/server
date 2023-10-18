const mongoose = require("mongoose");

const eventRegistration = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },

        userAge: {
            type: Number,
            required: true,
        },

        userGender: {
            type: String,
            enum: ["male", "female", "other"],
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        //the event to which this user is registered
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

eventRegistration.post('save', async function (doc) {
    try {
        const Event = mongoose.model('Event');
        await Event.updateOne(
            { _id: doc.eventId }, // Find the corresponding event
            { $push: { registrations: doc._id } } // Push the _id of the saved document to the registrations field
        );
    } catch (error) {
        console.error(`Error in updating event registrations: ${error}`);
    }
});


const EventRegistration = new mongoose.model("EventRegistration", eventRegistration);

module.exports = EventRegistration;
