const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const {startRescueOps, stopRescueOps, deleteRescueOps, isRescueOperationOnGoing} = require("../controllers/rescueOps.controller");

//Agency specific
router.post("/agency/start", auth, isAgency, startRescueOps);

router.put("/agency/stop/:rescueOpsId", auth, isAgency, stopRescueOps);

router.delete("/agency/delete/:rescueOpsId", auth, isAgency, deleteRescueOps);

router.get("/agency/isongoing", auth, isAgency, isRescueOperationOnGoing);

module.exports = router;
