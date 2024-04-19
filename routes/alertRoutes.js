const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const { sendAlert, showReceivedAlerts, deleteAlert, searchAlert } = require("../controllers/alerts.controller");

//Agency specific
router.post("/agency/sendalert", auth, isAgency, sendAlert);

router.delete("/agency/delete/:alertId", auth, isAgency, deleteAlert);

//public
router.get("/showreceived/:latitude/:longitude", auth, notAgency, showReceivedAlerts);

router.get("/search", auth, searchAlert);

module.exports = router;
