require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio credentials from environment variables (set in Render dashboard)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

app.get('/', (req, res) => {
  res.send('Twilio WhatsApp Server is running ✅');
});

app.post('/send-whatsapp', async (req, res) => {
  try {
    const { to, message } = req.body;

    const msg = await client.messages.create({
      from: `whatsapp:${twilioPhone}`,
      to: `whatsapp:${to}`,
      body: `New message from Ammu: ${message}`
    });

    res.json({ success: true, sid: msg.sid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
