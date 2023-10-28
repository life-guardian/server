const router = require("express").Router();
const auth = require("../middlewares/auth");
const {sendAlert, showReceivedAlerts} = require("../controllers/alerts.controller");

//Agency specific
router.post("/agency/sendalert", auth, sendAlert);


//public
router.post("/showreceived", auth, showReceivedAlerts);

module.exports = router;
