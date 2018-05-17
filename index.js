var express = require('express');
var bodyParser = require('body-parser');
var app = express().use(bodyParser.json());
var request = require('request');
const TOKEN = 'EAADJbdP7rTwBAP6qVQxc7ARfBBRecLZBmIRWP46tH03hWmKtDjdT1ZCLoG9PGWsU6Q2lmEySwH3MfC5ulTvWf5SlQtdfgiUuoO3bSBDZCOkUHbg3uPh3ire6t4qDoW93gdonwdqknQOfTrtCThMJD8JsWAiBBfDNImxR9kB5kdv6sV7dxrZB'
function reverse(str){
    var n = '';
    for(var i = str.length-1; i >= 0; i--)
        n += str.charAt(i);
    return (n);
}

app.post('/webhook', (req, res) => {

  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;
      console.log("psid : " + sender_psid);
      let message = webhook_event.message.text;
      // console.log('message = ' + message);
      let revmessage = reverse(message);
      // console.log('revmessage = ' + revmessage);
      if (revmessage === message){
          handleMessage(sender_psid, "oui");
          console.log('oui');
      } else {
          handleMessage(sender_psid, "non");
          console.log('non');
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

function handleMessage(sender_psid, received_message) {

  let response;
  if (received_message) {
      console.log("maman")
    response = {
      text: received_message
    }
  }
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  let request_body = {
    recipient: { id: sender_psid },
    message: response
  }

  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: TOKEN },
    method: "POST",
    json: request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}

app.listen(8080);
