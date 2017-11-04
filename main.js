var accountSid = 'ACd46513f712bc45dfc84cd49f51edef45'; // Your Account SID from www.twilio.com/console
var authToken = '9de0366e2ae88807ad3e74a1a8c6ad64';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+14169049147',  // Text this number
    from: '+16474960670' // From a valid Twilio number
})
.then((message) => console.log(message.sid));
