const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const { rescueMe, stopUserRescue, isAlreadyRescueMeStarted } = require("../controllers/userRescue.controller");

//user route
router.get("/user/isrescuemeongoing", auth, notAgency, isAlreadyRescueMeStarted);

router.post("/user/rescueme", auth, notAgency, rescueMe);

router.put("/user/stoprescueme", auth, notAgency, stopUserRescue);

module.exports = router;
