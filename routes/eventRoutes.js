const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const {
  agencyAddEvent,
  registerForEvent,
  showRegistrations,
  showEventsList,
  cancelEvent,
  showRegisteredEvents,
  upcomingNearbyEvents,
  eventDetails
} = require("../controllers/event.controller");

//Agency specific
router.post("/agency/add", auth, isAgency, agencyAddEvent);
router.get("/agency/list", auth, isAgency, showEventsList);
router.get("/agency/registrations", auth, isAgency, showRegistrations);

router.delete("/agency/cancel", auth, isAgency, cancelEvent);

//public
router.post("/register", auth, registerForEvent);
router.get("/registeredevents", auth, showRegisteredEvents);
router.get("/nearbyevents", auth, upcomingNearbyEvents);
router.get("/eventdetails", auth, eventDetails);

module.exports = router;
