const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const {startRescueOps} = require("../controllers/rescueOps.controller");

//Agency specific
router.post("/agency/start", auth, isAgency, startRescueOps);


module.exports = router;
