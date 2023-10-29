const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const {
  alertsHistory,
  eventsHistory,
  rescueOperationsHistory,
} = require("../controllers/history.controller");

//Agency specific
router.get("/agency/alerts", auth, isAgency, alertsHistory);
router.get("/agency/events", auth, isAgency, eventsHistory);
router.get("/agency/operations", auth, isAgency, rescueOperationsHistory);


module.exports = router;
