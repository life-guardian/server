const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  agencyAddEvent,
  registerForEvent,
  showRegistrations,
  showEventsList,
  cancelEvent,
  showRegisteredEvents,
  upcomingNearbyEvents,
} = require("../controllers/event.controller");

//Agency specific
router.post("/agency/add", auth, agencyAddEvent);
router.get("/agency/list", auth, showEventsList);
router.get("/agency/registrations", auth, showRegistrations);

router.delete("/agency/cancel", auth, cancelEvent);

//public
router.post("/register", auth, registerForEvent);
router.get("/registeredevents", auth, showRegisteredEvents);
router.get("/nearbyevents", auth, upcomingNearbyEvents);

module.exports = router;
