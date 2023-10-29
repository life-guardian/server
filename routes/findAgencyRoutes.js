const router = require("express").Router();
const auth = require("../middlewares/auth");
const isAgency = require("../middlewares/isAgency");
const notAgency = require("../middlewares/notAgency");
const {findAgency, agencyDetails} = require("../controllers/findAgency.controller");

//public
router.get("/agencies", auth, notAgency, findAgency); //show agencies matching the filters, here pass query params - searchText, page, limit

router.get("/agencydetails/:agencyId", auth, notAgency, agencyDetails);

module.exports = router;
