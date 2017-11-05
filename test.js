const http = require('http');
const express = require('express');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser());
app.use(session({
  secret: 'fff'
}));


app.post('/', async function(req, res) {
  const twiml = new MessagingResponse();
    let message = 'Hey! I\'m Stewie! What are your goals for today? \n\n Please format them with commas "to goal1, goal2, ..."';
    twiml.message(message)

  console.log("FUCK2")
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
