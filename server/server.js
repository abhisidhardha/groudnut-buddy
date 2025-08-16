import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';
import 'dotenv/config';
import connectDB from './db/config.js';
import User from './models/User.js';
import { generateUsername } from 'unique-username-generator';

const app = express();
connectDB();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const generateUniqueUsername = async () => {
  let isUnique = false;
  let username;
  let attempts = 0;

  while (!isUnique && attempts < 5) {
    username = generateUsername('', 0, 15); // Generate username without separator
    const existingUser = await User.findOne({ username });
    if (!existingUser) isUnique = true;
    attempts++;
  }

  if (!isUnique) throw new Error('Could not generate unique username');
  return username;
};

// Modified verify OTP endpoint


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

// Send OTP
// Send OTP
app.post('/api/send-otp', async (req, res) => {
  const { phone } = req.body;
  try {
    await client.verify.v2.services(verifySid)
      .verifications.create({ to: phone, channel: 'sms' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify OTP
// server.js (backend)
app.post('/api/verify-otp', async (req, res) => {
  const { phone, code } = req.body; // <-- Ensure this matches client's request body
  console.log('Request body:', req.body);
  if (!phone || !code) {
    return res.status(400).json({
      success: false,
      error: 'Phone and code are required',
    });
  }
  try {
    const verification_check = await client.verify.v2.services(verifySid)
      .verificationChecks.create({ to: phone, code });

    if (verification_check.status === 'approved') {
      const existingUser = await User.findOne({ phone });

      if (existingUser) {
        return res.json({
          success: true,
          username: existingUser.username,
          token: "YOUR_JWT_TOKEN" // Generate actual token
        });
      }

      const username = await generateUniqueUsername();
      const newUser = new User({ phone, username });
      await newUser.save();

      return res.json({
        success: true,
        username,
        token: "YOUR_JWT_TOKEN" // Generate actual token
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Add this route to handle prediction requests through Node.js if needed
app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/api/predict', req.body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Prediction service unavailable' });
  }
});


app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(process.env.PORT, () => console.log('Server running on port 5000'));
