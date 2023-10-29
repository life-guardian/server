const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const {
    updateLastLocationUser,
} = require("../controllers/userLocation.controller");

//public
router.put("/updatelastlocation", auth, notAgency, updateLastLocationUser);


module.exports = router;