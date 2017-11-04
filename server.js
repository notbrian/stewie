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


app.post('/', (req, res) => {
  let smsCount = req.session.counter || 0;
  let userMessage = req.body.Body
  let goals = []

  let message = 'Hey! Welcome to Stewie! What are your goals for today?';

  if ((smsCount > 0) && userMessage.toLowerCase().includes("goal")) {
    goals = userMessage.split("to").splice(-1, 1)[0].split(",").map((element) => {
      return element.replace(".", "").replace("and ", "").replace(" ", "")
    })


    let returnGoals = goals.slice(0).map((x) => {
      return " " + x
    })
    let lastGoal = returnGoals[returnGoals.length - 1]
    returnGoals.splice(returnGoals.length - 1, 1, (" and" + lastGoal))
    message = `So your goals are to${returnGoals}.`;

  } else if ((smsCount > 0) && userMessage.toLowerCase().includes("yes")) {
    message = 'Great! I\'ll check up on you later today!';
  }

  req.session.counter = smsCount + 1;

  const twiml = new MessagingResponse();
  twiml.message(message);

  console.log(goals)
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
