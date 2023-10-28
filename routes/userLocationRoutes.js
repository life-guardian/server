const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    uodateLastLocationUser,
} = require("../controllers/userLocation.controller");


router.put("/updatelastlocation", auth, uodateLastLocationUser);


module.exports = router;