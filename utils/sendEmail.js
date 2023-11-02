const nodemailer = require('nodemailer');

const sendMail = (emails, emailSubject, emailContent) => {

  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: emails,
      subject: emailSubject,
      html: emailContent
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = sendMail;