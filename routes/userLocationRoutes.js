const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const {
    updateLastLocationUser,
} = require("../controllers/userLocation.controller");

//public
router.put("/updatelastlocation", auth, updateLastLocationUser);


module.exports = router;