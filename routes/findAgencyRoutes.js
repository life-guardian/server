const router = require("express").Router();
const auth = require("../middlewares/auth");
const {findAgency, agencyDetails} = require("../controllers/findAgency.controller");

//public
router.get("/agencies", auth, findAgency); //show agencies matching the filters

router.get("/agencydetails", auth, agencyDetails);

module.exports = router;
