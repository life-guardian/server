const mongoose = require("mongoose");
const Event = require("../models/eventModel");
const Agency = require("../models/agencyModel");
const User = require("../models/userModel");

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
    const event = await Event.findOne({ _id: eventId, agencyId: req.user.id}).populate({
      path: "registrations",
      select: "name phoneNumber",
    });

    if (!event) {
      return res.status(404).json({ message: "You have not added this event" });
    }

    const registrations = event.registrations.map((user) => ({
      userName: user.name,
      phoneNumber: user.phoneNumber,
    }));

    res.status(200).json(registrations);
  } catch (error) {
    handleServerError(res, error, "Error in showing registrations");
  }
};

//agency
const cancelEvent = async (req, res) => {
  const { eventId } = req.body;

  try {
    const event = await Event.findOne({ _id: eventId, agencyId: req.user.id });

    if (!event) {
      return res.status(403).json({ message: "You have not added this event" });
    }

    const deletedEvent = await Event.findOneAndDelete({ _id: eventId });

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const registrations = deletedEvent.registrations;

    // Using Promise.all to handle promises in parallel
    await Promise.all([
      User.updateMany(
        { _id: { $in: registrations } }, // Find the users in the registrations array of the deleted event
        { $pull: { registeredEvents: eventId } } // Pull the eventId from the registeredEvents array of each user
      ),
    ]);

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

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { registeredEvents: foundEvent._id } }
    );

    res.status(200).json({ message: "Successfully registered for the event!" });
  } catch (error) {
    handleServerError(res, error, "Error in registering for event");
  }
};

//user
const showRegisteredEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("registeredEvents");
    const response = user.registeredEvents.map((event) => ({
      eventId: event._id,
      eventName: event.eventName,
      agencyName: event.agencyId.name,
      eventDate: event.eventDate,
    }));

    res.status(200).json(response);
  } catch (error) {
    handleServerError(res, error, "Error in fetching registered events");
  }
};

//user
const upcomingNearbyEvents = async (req, res) => {
  const { locationCoordinates } = req.body;
  try {
    // Convert kilometers to miles as the query accepts distance in miles
    const radiusInMiles = 20 / 1.60934;

    const options = {
      location: {
        $geoWithin: {
          $centerSphere: [
            [
              parseFloat(locationCoordinates[0]),
              parseFloat(locationCoordinates[1]),
            ],
            radiusInMiles / 3963.2,
          ],
        },
      },
    };

    const events = await Event.find(options).populate("agencyId");

    const response = events.map((event) => ({
      eventId: event._id,
      eventName: event.eventName,
      agencyName: event.agencyId.name,
      eventDate: event.eventDate,
    }));

    res.status(200).json(response);
  } catch (error) {
    handleServerError(res, error, "Error in finding upcoming Nearby Events");
  }
};

//user
const eventDetails = async (req, res) => {
  const { eventId } = req.body;
  try {
    const event = await Event.findById(eventId).populate("agencyId");

    const response = {
      eventId: event._id,
      eventName: event.eventName,
      eventDescription: event.description,
      eventDate: event.eventDate,
      agencyName: event.agencyId.name,
      eventLocation: event.location.coordinates,
    };

    res.status(200).json(response);
  } catch (error) {
    handleServerError(res, error, "Error in fetching event details");
  }
};

module.exports = {
  agencyAddEvent,
  registerForEvent,
  showRegistrations,
  showEventsList,
  cancelEvent,
  showRegisteredEvents,
  upcomingNearbyEvents,
  eventDetails,
};
