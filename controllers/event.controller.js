const mongoose = require("mongoose");
const Event = require("../models/eventModel");
const Agency = require("../models/agencyModel");

const handleServerError = (res, error, message) => {
  console.error(`${message} : ${error}`);
  res.status(500).json({ message: "Internal server error" });
};

//agency
const agencyAddEvent = async (req, res) => {
  const { eventName, description, latitude, longitude, eventDate } = req.body;

  try {
    // Find events for the same date
    const found = await Event.findOne({
      agencyId: req.user.id,
      eventDate: {
        $gte: new Date(eventDate).setHours(0, 0, 0, 0),
        $lt: new Date(eventDate).setHours(23, 59, 59, 999),
      },
    });

    if (found) {
      return res
        .status(400)
        .json({ message: "You already have an event on this date" });
    }

    const location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };
    const event = new Event({
      eventName,
      description,
      agencyId: req.user.id,
      location,
      eventDate,
    });
    await event.save();
    res.status(200).json({ message: "Event added successfully" });
  } catch (error) {
    handleServerError(res, error, "Error in adding event");
  }
};

//agency

const showEventsList = async (req, res) => {
  try {
    const found = await Event.find({ agencyId: req.user.id });

    if (!found) {
      return res.status(404).json({ message: "Events not added" });
    }

    const events = found.map((event) => ({
      eventId: event._id,
      eventName: event.eventName,
      eventPlace: event.location.coordinates,
      eventDate: event.eventDate,
    }));

    res.status(200).json(events);
  } catch (error) {
    handleServerError(res, error, "Error in showing events list");
  }
};

//agency
const showRegistrations = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findById(eventId).populate(
      "registrations",
      "name phoneNumber"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = event.registrations.map((user) => ({
      userName: user.name,
      phoneNumber: user.phoneNumber,
    }));

    res.status(200).json({ registrations });
  } catch (error) {
    handleServerError(res, error, "Error in showing registrations");
  }
};

//agency
const cancelEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    // Find the event by its ID and remove it
    const deletedEvent = await Event.findByIdAndRemove(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    handleServerError(res, error, "Error in deleting event");
  }
};

//user
const registerForEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    // Check if the event exists in the database
    const foundEvent = await Event.findById(eventId);
    if (!foundEvent) {
      return res
        .status(400)
        .json({ message: "Event you are trying to register does not exist" });
    }

    // Check if the loggedIn user is already registered for the event
    const exists = foundEvent.registrations.includes(req.user.id);
    if (exists) {
      return res
        .status(400)
        .json({ message: "You have already registered for this event" });
    }

    // Update the event with the user's registration
    foundEvent.registrations.push(req.user.id);
    await foundEvent.save();

    res.status(200).json({ message: "Successfully registered for the event!" });
  } catch (error) {
    handleServerError(res, error, "Error in registering for event");
  }
};

module.exports = {
  agencyAddEvent,
  registerForEvent,
  showRegistrations,
  showEventsList,
  cancelEvent,
};
