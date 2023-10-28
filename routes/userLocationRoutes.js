const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
    updateLastLocationUser,
} = require("../controllers/userLocation.controller");


router.put("/updatelastlocation", auth, updateLastLocationUser);


module.exports = router;