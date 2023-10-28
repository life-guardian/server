const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  alertsHistory,
  eventsHistory,
  rescueOperationsHistory,
} = require("../controllers/history.controller");

//Agency specific
router.get("/agency/alerts", auth, alertsHistory);
router.get("/agency/events", auth, eventsHistory);
router.get("/agency/operations", auth, rescueOperationsHistory);


module.exports = router;
