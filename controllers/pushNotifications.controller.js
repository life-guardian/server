const admin = require("firebase-admin");
var fcm = require("fcm-notification");
var serviceAccount = require("../config/push-notification-key.json");

const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const sendPushNotification = (req, res, next) => {
  try {
    const message = {
      notificaton: {
        title: "Notification Title",
        body: "Notification Data",
      },
      data: {
        orderId: "12454",
        orderName: "Ok Pratik",
      },
      token: req.body.fcmtoken,
    };

    FCM.send(message, function (err, resp) {
      if (err) {
        return res.status(500).json({ message: err });
      } else {
        return res.status(200).json({ message: "Notification sent" });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err });
  }
};

module.exports = { sendPushNotification };
