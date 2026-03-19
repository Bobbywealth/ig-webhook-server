const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'ig_webhook_secret_123';

app.use(express.json());

// Webhook verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified!');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Webhook events (POST)
app.post('/webhook', (req, res) => {
  const body = req.body;
  console.log('Received webhook event:', JSON.stringify(body, null, 2));

  if (body.object === 'instagram') {
    body.entry.forEach(entry => {
      if (entry.messaging) {
        entry.messaging.forEach(event => {
          console.log('Instagram messaging event:', JSON.stringify(event, null, 2));
        });
      }
    });
    return res.status(200).send('EVENT_RECEIVED');
  }
  return res.sendStatus(404);
});

// Health check
app.get('/', (req, res) => {
  res.send('IG Webhook Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
