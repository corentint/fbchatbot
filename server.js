var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var buttons = require('./button');  
var app = express();

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) { 
    res.send('This is TestBot Server 123');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    let verify_token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (verify_token === 'testbot_verify_token') {
        res.send(challenge);
    } else {
        res.send('Invalid verify token');
    }
});

// handler receiving messages
app.post('/webhook', function (req, res) {  
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        console.log(event.sender.id);
        // if (event.postback.payload === 'TOPIC_CSHARP_SELECTED')
        // {
        //     sendMessage(event.sender.id, {text: "C# topic selected"});
        // }

        if (event.message && event.message.text) {
            console.log("ID : " + event.sender.id);
            //sendMessage(event.sender.id, {text: "Choose a technical topic: " + event.message.text});
            sendMessage(event.sender.id, getButtonMessage());
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) { 
    console.log("page access token : " + process.env.PAGE_ACCESS_TOKEN); 
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

function getButtonMessage() {
    return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Welcome ! Which topic would you like to study ?",
        "buttons":[
          {
            "type":"postback",
            "title":"C#",
            "payload": "TOPIC_CSHARP_SELECTED"
          },
          {
            "type":"postback",
            "title":"Typescript",
            "payload":"TOPIC_TYPESCRIPT_SELECTED"
          }
        ]
      }
    }
  }
}