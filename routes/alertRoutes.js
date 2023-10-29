const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const {sendAlert, showReceivedAlerts} = require("../controllers/alerts.controller");

//Agency specific
router.post("/agency/sendalert", auth, isAgency, sendAlert);


//public
router.post("/showreceived", auth, showReceivedAlerts);

module.exports = router;
