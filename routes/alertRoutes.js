const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const {sendAlert, showReceivedAlerts} = require("../controllers/alerts.controller");

//Agency specific
router.post("/agency/sendalert", auth, isAgency, sendAlert);


//public
router.get("/showreceived", auth, notAgency, showReceivedAlerts);

module.exports = router;
