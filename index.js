const { default: axios } = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const mysql = require('mysql');
require('dotenv').config();

const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.token,
  channelSecret: process.env.secretcode
}

//mysql connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: null,
    database: 'line_data'
})

connection.connect((err) => {
    if(err) {
        console.log('Error connecting to MySQL database = ', err)
        return;
    }
    console.log('MySQL successfully connected!');
})

app.post('/webhook' , line.middleware(config), (req,res) => {
  const events = req.body.events;
  if (!events) {
    res.status(400).send('No events in request body');
    return;
  }

  Promise
    .all(
      events.map(event => handleEvents(event))
    )
    .then((result) => res.json(result))
    .catch((err) => {
      console.error('Error handling events:', err);
      res.status(500).send('Internal Server Error');
    });
});

const client = new line.Client(config);

function handleEvents(event) {

console.log(event);
 
if(event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
}

return client.replyMessage(event.replyToken, [
    {
        "type": "text",
        "text":  'รับข้อมูลเรียบร้อย',
        "quickReply":  [
            {
                "type" : "action",
                "action": {
                    "type": "message",
                    "label": "Yes",
                    "text": "Yes"
                }
            },
            {
                "type" : "action",
                "action": {
                    "type": "message",
                    "label": "No",
                    "text": "No"
                }
            },
        ]
    }, 
])

}

app.get('/', (req,res) => {
  res.send('ok');
})

app.listen(4000, () => console.log('start server on port 4000'));