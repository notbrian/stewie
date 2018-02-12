// Import modules
const http = require('http');
const express = require('express');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const accountId = process.env.twilioID;
const authToken = process.env.twilioAuthToken;
const client = require('twilio')(accountId, authToken);
const path = require('path');

// Import database
let firebase = require('firebase/app');
require('firebase/database');

// Setup API credentials
let config = {
  apiKey: process.env.firebaseKey,
  authDomain: 'stewie-data.firebaseapp.com',
  databaseURL: 'https://stewie-data.firebaseio.com',
  projectId: 'stewie-data',
  storageBucket: 'stewie-data.appspot.com',
  messagingSenderId: '88026906065',
};

// Initalize Firebase
firebase.initializeApp(config);

// Declare express server
const app = express();

// Create server with bodyParser
app.use(bodyParser());

// Create server session
app.use(session({
  secret: 'fff',
}));

// Set Access-Control headers for all endpoints
app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,' +
    'Content-Length, X-Requested-With');
  res.send(200);
});

// Setup React Production build files as static
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Sets home endpoint to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/frontend/build/index.html'));
});

// Endpoint that handles all Twilio related commands (Webhook)
app.post('/backend', async function(req, res) {
  // Initalizes variable to track messages per conversation
  let smsCount = req.session.counter || 0;
  // Sets inCompleting variable to false if it doesn't already exist
  // (Used to guess if the user wants to set goals)
  req.session.isCompleting = req.session.isCompleting || false;

  // Initalizes variable containing the latest text from the user
  let userMessage = req.body.Body;
  // Formats number of the user and puts it into a variable
  // (e.g +1416049147 --> 4169049147)
  let fromNumber = req.body.From.replace('+1', '');
  // Creates a MessagingResponse object
  const twiml = new MessagingResponse();
  // If this isn't the first message from the user and
  // it contains the word "goal", the user is adding goals
  if (userMessage.toLowerCase().includes('goal')) {
    // Splits the user message and formats it into the
    // goal variable for the database
    // e.g "My goals are to chew bubble gum and kick ass"
    // --> ['eat a banana, kick ass']
     goals = userMessage
      .split('to')
      .splice(-1, 1)[0];
    if (goals.includes(',')) {
      goals = goals.split(',');
    } 
	if (goals[goals.length -1].includes('and')) {
	  goals[goals.length -1] = goals[goals.length -1].replace('and', '');
    }
	if (goals.includes('and')) {
		goals = goals.split('and');
    }
    if (typeof goals !== "array") {
	goals = [goals];
    }
 
    goals.map((element) => {
      return element.replace('.', '').replace(' ', '');
    });
    // Formats response message back to user
    // e.g So your goals are to eat a banana, kick ass?
    // --> So your goals are to eat a banana, and kick ass?
    let messageGoals = goals.slice(0);
    if (messageGoals.length == 2) {
      messageGoals[messageGoals.length - 1] = ' and' +
        messageGoals[messageGoals.length - 1];
    }
    message = `To confirm, your goals are to:${messageGoals}?`;
    // Sends message back to user using Twilio
    twiml.message(message);
    console.log(goals);
    // Else if the message count is above 0 and the message includes yes,
    // assume that the user is trying to confirm their goal choices
  } else if ((smsCount > 0) && userMessage.toLowerCase().includes('yes')) {
    // Response to the user
    message = 'Great! I\'ll keep them in mind and check up on you later today!';
    twiml.message(message);
    // Formats goals to send to the firebase
    // ['eat a banana, kick ass']
    // --> [{goal: 'eat a banana', isCompleted: false}, etc]
    let goalsData = [];
    for (let x = 0; x < goals.length; x++) {
      // Pushes formatted goals into array
      goalsData.push({
        goal: goals[x],
        isCompleted: false,
      });
    }
    // Initalizes formattedDate variable with the current date
    // e.g Feb 09
    let formattedDate = Date().slice(4, 10);
    // Sets the date and the associated goals under
    // the users phone number on Firebase
    // E.g {
    //  '4169049147': {'Feb 09': [{goal: 'Chew bubble gum',
    // isCompleted: false }]}
    //      }
    firebase.database().ref(fromNumber + '/goals').update({
      [formattedDate]: goalsData,

    });
    // If the message count is over 1 and the message includes no,
    // Assume the user messed up their input and tell them to try again
  } else if ((smsCount > 1) && userMessage.toLowerCase().includes('no')) {
    message = 'Oh no! Try entering them again please.';
    twiml.message(message);
    // If the user message includes finished,
    // assume they want to complete some tasks
  } else if (userMessage.toLowerCase().includes('finished')) {
    message = 'Great! Which goals did you finish? Enter the numbers!\n';
    // Finds the current date (E.g Feb 09)
    let currentDate = Date().slice(4, 10);
    // Grabs the current goals from the users firebase data
    // synchronous function, waits for data to load before proceding
    let snapshot = await firebase.database()
      .ref(fromNumber + '/goals').once('value');
    // Gets the value of the snapshot into JASON
    let data = snapshot.val();
    // Formats message with their goals next to numbers
    // E.g:
    // Great! Which goals did you finish? Enter the numbers!
    //
    // 1. Chew bubble gum
    // 2. Kick ass
    for (let x = 0; x < data[currentDate].length; x++) {
      message = message + `\n ${x + 1}. ${data[currentDate][x].goal}`;
    }

    twiml.message(message);
    // Indicates that the next message the user sends
    // is related to completing goals
    req.session.isCompleting = true;
    // If the user is completing
  } else if (req.session.isCompleting) {
    // Changes inCompleting back to false
    req.session.isCompleting = false;
    let currentDate = Date().slice(4, 10);
    let snapshot = await firebase.database()
      .ref(fromNumber + '/goals').once('value');
    let data = snapshot.val();

    // Loops through array from 1 to 7,
    // If the user message includes one of them,
    // Change the corresponding goal to completed
    for (let element of [1, 2, 3, 4, 5, 6, 7]) {
      if (userMessage.includes(JSON.stringify(element))) {
        element -= 1;
        data[currentDate][element].isCompleted = true;
      }
    }
    // Set the new data to the Firebase
    firebase.database().ref(fromNumber + '/goals').update(
      data
    );
    message = 'I\'ve cleared them on your checklist! Keep it up!';
    twiml.message(message);
    // If the user messages hello, greet them and give them instructions
  } else if (userMessage.toLowerCase().includes('hello')) {
    message = 'Hey! I\'m Stewie! What are your goals for today?' +
      '\n\n Please format them as "My goals are to goal1, goal2, ..."';
    twiml.message(message);
    // If the user messages 'approve',
    // change the isAuth value on their Firebase data to true
  } else if (userMessage.toLowerCase().includes('approve')) {
    message = 'Authenticating!';
    twiml.message(message);
    // Change isAuth value to true
    firebase.database().ref(fromNumber).update({
      isAuth: true,
    });
  }
  // Everytime webhook is called, increase the session counter
  // to indicate 1 message has been sent
  req.session.counter = smsCount + 1;
  // Set response header to text
  res.writeHead(200, {
    'Content-Type': 'text/xml',
  });
  // End response to Twilio by formatting our twiml object to a string
  res.end(twiml.toString());
});

// Endpoint when the user presses 'GO' on the landing page
app.post('/sendStart', function(req, res) {
  console.log('Recieved ${req.body.phoneNumber}!');
  let message = 'Hey! I\'m Stewie! 👋 To approve this login request' +
    ' please say "approve"';
  // Creates messages object to start conversation with a new user
  client.messages
    .create({
      // Send to user phone number recieved from landing pagae
      to: req.body.phoneNumber,
      from: '+16474960670',
      body: message,
    });
  // Sets response header
  res.writeHead(200, {
    'Content-Type': 'text/xml',
  });
  // Finish response
  res.end();

  // Sets the isAuth variable on the users firebase data to false
  firebase.database().ref(req.body.phoneNumber).update({
    isAuth: false,
  });
});

// Create HTTP server listening at the PORT variable or 1337
http.createServer(app).listen(process.env.PORT || 1337, () => {
  console.log('Express server listening on port ' + process.env.PORT);
});
