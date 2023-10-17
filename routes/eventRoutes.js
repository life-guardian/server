const router = require("express").Router();
const auth = require("../middlewares/auth");
const {adminAddEvent, registerForEvent} = require("../controllers/event.controller");

//Agency specific
router.post('/add', auth, adminAddEvent);


//public
router.post('/register', auth, registerForEvent);

module.exports = router;

