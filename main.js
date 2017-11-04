var accountSid = 'ACd46513f712bc45dfc84cd49f51edef45'; // Your Account SID from www.twilio.com/console
var authToken = '9de0366e2ae88807ad3e74a1a8c6ad64';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

client.api.calls
  .create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+14169049147',
    from: '+16474960670',
  })
  .then((call) => console.log(call.sid));
