const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const {
  agencyAddEvent,
  registerForEvent,
  showRegistrations,
  showEventsList,
  cancelEvent,
  showRegisteredEvents,
  upcomingNearbyEvents,
  eventDetails,
  searchEvent,
  cancelEventRegistration,
} = require("../controllers/event.controller");

//Agency specific
router.post("/agency/add", auth, isAgency, agencyAddEvent);
router.get("/agency/list", auth, isAgency, showEventsList);
router.get("/agency/registrations/:eventId", auth, isAgency, showRegistrations);

router.delete("/agency/cancel/:eventId", auth, isAgency, cancelEvent);

//public
router.put("/register", auth, notAgency, registerForEvent);
router.delete("/cancel-registration/:eventId", auth, notAgency, cancelEventRegistration);
router.get("/registeredevents", auth, notAgency, showRegisteredEvents);
router.get("/nearbyevents/:latitude/:longitude", auth, notAgency, upcomingNearbyEvents);
router.get("/eventdetails/:eventId", auth, notAgency, eventDetails);

router.get("/search", auth, searchEvent);

module.exports = router;
