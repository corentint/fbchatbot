var express = require('express');  
var bodyParser = require('body-parser');  
var request = require('request');  
var app = express();

app.use(bodyParser.urlencoded({extended: false}));  
app.use(bodyParser.json());  
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) { 
    console.log("get first part"); 
    res.send('942634981');
    console.log("get second part"); 
});

// Facebook Webhook
app.get('/webhook', function (req, res) {  
    console.log("web hook");
    console.log("verify toen : " + req.query['hub.verify_token']);
    console.log("hub challenge : " + req.query['hub.challenge']);
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});