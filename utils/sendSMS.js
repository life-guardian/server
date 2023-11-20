const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
})


const from = "LifeGuard"

const sendSMS = async(to, text)=> {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(JSON.stringify(resp)); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(JSON.stringify(err)); });
}

module.exports = sendSMS;