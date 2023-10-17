const mongoose = require("mongoose");
const Event = require("../models/eventModel");
const Agency = require("../models/agencyModel");
const EventRegistration = require("../models/eventRegistrationModel");


const adminAddEvent = async (req, res) => {
    const { eventName, description, latitude, longitude, eventDate } = req.body;

    try {
        // Find events for the same date
        const found = await Event.findOne({
            agencyId: req.user.id,
            eventDate: {
                $gte: new Date(eventDate).setHours(0, 0, 0, 0),
                $lt: new Date(eventDate).setHours(23, 59, 59, 999)
            }
        });

        if (found) {
            return res.status(400).json({ message: "You already have an event on this date" });
        }

        const location = {
            latitude,
            longitude,
        };
        const event = new Event({
            eventName,
            description,
            agencyId: req.user.id,
            location,
            eventDate
        });
        await event.save();
        res.status(200).json({ message: "Event added successfully" });

    } catch (error) {
        console.error(`Error in adding event : ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
};


const registerForEvent = async (req, res) => {
    const { userName, userAge, userGender, eventId } = req.body;

    try {

        //checking if the event exists in db
        const eventExists = await Event.findById(eventId);

        if(!eventExists){
            return res.status(400).json({message: "Event you are trying to register does not exists"});
        }

        //checking if the loggedIn user is already registered for the event
        const alreadyRegistered = await EventRegistration.findOne({ userId: req.user.id });

        if (alreadyRegistered) {
            return res.status(400).json({ message: "You have already registered for this event" });
        }

        const registration = new EventRegistration({
            userName, userAge: Number(userAge), userGender: userGender.toLowerCase(), eventId
        });

        registration.userId = req.user.id;

        await registration.save();

        //some part of registration is handeled in post hook in EventRegistration model

        res.status(200).json({message: "successfully registered for the event!"});

    } catch (error) {
        console.error(`Error in registering for event : ${error}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { adminAddEvent, registerForEvent }