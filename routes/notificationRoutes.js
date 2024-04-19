const router = require("express").Router();

const { sendPushNotification } = require("../controllers/pushNotifications.controller");

router.post("/send-notification", auth, sendPushNotification);

module.exports = router;
