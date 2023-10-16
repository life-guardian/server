const router = require("express").Router();
const auth = require("../middlewares/auth");
const {adminAddEvent} = require("../controllers/event.controller");

router.post('/add', auth, adminAddEvent);


