const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const {startRescueOps, deleteRescueOps} = require("../controllers/rescueOps.controller");

//Agency specific
router.post("/agency/start", auth, isAgency, startRescueOps);

router.delete("/agency/delete/:rescueOpsId", auth, isAgency, deleteRescueOps);

module.exports = router;
