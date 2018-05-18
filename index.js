const TOKEN = 'EAANgh8wiQlgBAEVB91QolzHRNNaeiKp7UTVII7AGxob6CjfoqOLvFVc8rWppaVDEQtbwsOG06s50ZCkvRQ1tfkhucRdjHwePwDMD7emIKEFUPvYJswIKVNDC5QcuDog3OJOddBaDJJY5b8LhDWQu8Na8XdaR6bZC2pyxVTXgZDZD'
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json());
const request = require('request');
function reverse(str){
    var n = '';
    for(var i = str.length - 1; i >= 0; i--)
        n += str.charAt(i);
    return (n);
}

app.post('/webhook', (req, res) => {

  let body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;
      let message = webhook_event.message.text;
      let revmessage = reverse(message);
      if (revmessage === message){
          handleMessage(sender_psid, "oui");
      } else {
          handleMessage(sender_psid, "non");
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
    response = { text: received_message }
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
      if (err){
          console.error("Unable to send message:" + err);
      }
  });
}

app.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = "verify_token"
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
}
})

app.listen(8000);
