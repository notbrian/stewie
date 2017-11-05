const http = require('http');
const express = require('express');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const accountSid = 'ACd46513f712bc45dfc84cd49f51edef45';
const authToken = '9de0366e2ae88807ad3e74a1a8c6ad64';
const client = require('twilio')(accountSid, authToken);



var firebase = require('firebase/app');
require('firebase/database');

var config = {
  apiKey: "AIzaSyCyTpihMAroNqReFOErgq210gJdU2fYU9Y",
  authDomain: "stewie-data.firebaseapp.com",
  databaseURL: "https://stewie-data.firebaseio.com",
  projectId: "stewie-data",
  storageBucket: "stewie-data.appspot.com",
  messagingSenderId: "88026906065"
};
firebase.initializeApp(config);
var database = firebase.database();


const app = express();

app.use(bodyParser());
app.use(session({
  secret: 'fff'
}));


app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

app.post('/', async function(req, res) {
  let smsCount = req.session.counter || 0;
  req.session.isCompleting = req.session.isCompleting || false
  let userMessage = req.body.Body
  let fromNumber = req.body.From.replace("+1", "")
  const twiml = new MessagingResponse();
  if (typeof variable === 'undefined') {
    let goals = [];
  }


  if ((smsCount > 0) && userMessage.toLowerCase().includes("goal") ) {
    goals = userMessage.split("to").splice(-1, 1)[0].split(",").map((element) => {
      return element.replace(".", "").replace("and ", "").replace(" ", "")
    })


    let returnGoals = goals.slice(0).map((x) => {
      return " " + x
    })
    let lastGoal = returnGoals[returnGoals.length - 1]
    returnGoals.splice(returnGoals.length - 1, 1, (" and" + lastGoal))
    message = `So your goals are to${returnGoals}?`;
    twiml.message(message)

  } else if ((smsCount > 0) && userMessage.toLowerCase().includes("yes")) {
    message = 'Great! I\'ll keep them in mind and check up on you later today!';
    twiml.message(message)
    console.log(goals)
    var goalsData = []
    for (var x = 0; x < goals.length; x++) {
      goalsData.push({
        goal: goals[x],
        isCompleted: false
      })
    }
    var formattedDate = Date().slice(4, 10)

    firebase.database().ref(fromNumber + "/" + formattedDate).update({
        goals: goalsData

    });

  } else if ((smsCount > 1) && userMessage.toLowerCase().includes("no")) {
    message = 'Oh no! Try entering them again please.'
    twiml.message(message)
  } else if (userMessage.toLowerCase().includes("finished")) {
    message = 'Great! Which goals did you finish? Enter the numbers!\n'
    let currentDate = Date().slice(4, 10)
    let snapshot = await firebase.database().ref(fromNumber).once('value')
    let data = snapshot.val()
    for (let x = 0; x < data[currentDate].goals.length; x++) {
      message = message + `\n ${x + 1}. ${data[currentDate].goals[x].goal}`
    }

    twiml.message(message)
    req.session.isCompleting = true


  } else if (req.session.isCompleting) {
    req.session.isCompleting = false
    let currentDate = Date().slice(4, 10)
    let snapshot = await firebase.database().ref(fromNumber).once('value')
    let data = snapshot.val()
    if (userMessage.toLowerCase().includes("1")) {
      data[currentDate].goals[0].isCompleted = true
    }
    if (userMessage.toLowerCase().includes("2")) {
      data[currentDate].goals[1].isCompleted = true

    }
    if (userMessage.toLowerCase().includes("3")) {
      data[currentDate].goals[2].isCompleted = true
    }
    if (userMessage.toLowerCase().includes("4")) {
      data[currentDate].goals[3].isCompleted = true
    }
    if (userMessage.toLowerCase().includes("5")) {
    data[currentDate].goals[4].isCompleted = true
    }
    if (userMessage.toLowerCase().includes("6")) {
      data[currentDate].goals[5].isCompleted = true
    }
    if (userMessage.toLowerCase().includes("7")) {
      data[currentDate].goals[6].isCompleted = true
    }


    firebase.database().ref(fromNumber).set(
      data
    );
    message = "I've cleared them on your checklist! Keep it up!"
    twiml.message(message)

  } else if (userMessage.toLowerCase().includes("hello")) {
    message = "I've cleared them on your checklist! Keep it up!"
    twiml.message(message)
  }
  req.session.counter = smsCount + 1;
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());
});

app.post('/sendStart', function(req, res) {
  console.log("Recieved number!")
  console.log(req.body.phoneNumber)
  let message = 'Hey! I\'m Stewie! What are your goals for today? \n\n Please format them with commas "to goal1, goal2, ..."';
  client.messages
    .create({
      to: req.body.phoneNumber,
      from: '+16474960670',
      body: message,
    })
    .then((message) => console.log(message.sid));
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end();
})

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
