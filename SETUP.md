# SurveyBuddy Setup Guide

## Overview
SurveyBuddy is an AI-powered phone survey system that uses Twilio for calls, ElevenLabs for personalized voice, OpenAI's Whisper for transcription, and GPT for empathetic AI responses.

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- ngrok (for exposing localhost to Twilio)
- API keys for:
  - OpenAI
  - ElevenLabs
  - Twilio (with a phone number)

---

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

---

## Step 2: Set Up External Services

### 2.1 MongoDB
**Option A: Local Installation**
1. Download and install MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Start MongoDB:
   ```bash
   mongod
   ```
   mine was mongosh
3. Your connection string will be: `mongodb://localhost:27017/surveybuddy`

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string and replace in `.env`

### 2.2 OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create an API key
3. Copy the key for your `.env` file

### 2.3 ElevenLabs
1. Sign up at https://elevenlabs.io/
2. Go to your Profile → API Keys
3. Copy your API key
4. Get a voice ID:
   - Go to Voices in the dashboard
   - Use a pre-built voice like "Adam" (ID: `21m00Tcm4TlvDq8ikWAM`)
   - Or browse other voices at https://elevenlabs.io/voice-library

### 2.4 Twilio
1. Sign up at https://www.twilio.com/try-twilio (free trial with $15 credit)
2. Go to Console Dashboard
3. Get your **Account SID** and **Auth Token**
4. Buy a phone number:
   - Navigate to Phone Numbers → Buy a Number
   - Choose a number with Voice capabilities (~$1/month)
   - Copy your Twilio phone number (format: +1234567890)

---

## Step 3: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your actual credentials:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/surveybuddy

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# ElevenLabs
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-account-sid-here
TWILIO_AUTH_TOKEN=your-twilio-auth-token-here
TWILIO_PHONE_NUMBER=+1234567890

# Server
PORT=3001
```

---

## Step 4: Set Up ngrok (for Twilio Webhooks)

Twilio needs a public URL to send webhook requests. Use ngrok to expose your local server:

1. Download ngrok: https://ngrok.com/download
2. Install and authenticate:
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```
3. Start ngrok (in a separate terminal):
   ```bash
   ngrok http 3001
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. You'll use this URL in the webapp when initiating calls

**Important:** Keep the ngrok terminal running while testing!

---

## Step 5: Start the Application

### Terminal 1: Start MongoDB (if local)
```bash
mongod
```
for me mongosh

### Terminal 2: Start Backend Server
```bash
cd backend
node server.js
```

You should see:
```
Server running on port 3001
Connected to MongoDB
Make sure to set up ngrok or expose this server publicly for Twilio webhooks
```

### Terminal 3: Start Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.2.2  ready in 392 ms
➜  Local:   http://localhost:5173/
```

### Terminal 4: Start ngrok
```bash
ngrok http 3001
```

Copy the HTTPS forwarding URL (e.g., `https://abc123.ngrok.io`)

---

## Step 6: Use the Application

1. Open your browser to http://localhost:5173/
2. You'll see the SurveyBuddy interface with two tabs:
   - **Create Survey**: Create and initiate surveys
   - **View Responses**: See completed survey responses

### Creating a Survey:
1. Enter the phone number to call (format: +1234567890)
   - **Important:** For Twilio trial accounts, you must verify phone numbers first in the Twilio console
2. Paste your ngrok URL in the "Ngrok URL" field (e.g., `https://abc123.ngrok.io`)
3. Add your survey questions (click "+ Add Question" for more)
4. Click "Create Survey & Make Call"
5. Twilio will initiate the call!

### Call Flow:
1. The recipient answers the phone
2. AI asks the first question (using Twilio's built-in TTS or ElevenLabs)
3. Recipient speaks their answer
4. Whisper transcribes the answer
5. GPT generates a short, empathetic response
6. AI delivers the response
7. Repeat for all questions
8. Call ends with a thank you message

### Viewing Responses:
1. Switch to the "View Responses" tab
2. See all survey responses with Q&A pairs
3. Click "Download JSON" to download response data

---

## Step 7: Testing

### Test with a Verified Number:
For Twilio trial accounts, you can only call verified numbers:
1. Go to Twilio Console → Phone Numbers → Verified Caller IDs
2. Click "+" to add a phone number
3. Enter your phone number and verify it via SMS/call
4. Now you can call this number from the app!

### Sample Test Questions:
- "How was your experience with our service today?"
- "What did you like most about our product?"
- "Is there anything we could improve?"

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Twilio Call Not Working
- Verify ngrok is running and URL is correct
- Check Twilio credentials in `.env`
- Ensure phone number is verified (for trial accounts)
- Check Twilio console for error logs

### CORS Errors
- Backend is configured with CORS enabled
- Ensure backend is running on port 3001
- Frontend should be on port 5173

### OpenAI/ElevenLabs Errors
- Verify API keys are correct
- Check account billing/credits
- Review API rate limits

### ngrok Session Expired
- Free ngrok URLs expire after 2 hours
- Restart ngrok and update the URL in the webapp

---

## Cost Estimates (per survey call)

- **Twilio**: ~$0.013/minute (outbound calls)
- **ElevenLabs**: ~$0.18/1K characters (TTS)
- **OpenAI Whisper**: ~$0.006/minute
- **OpenAI GPT-4o-mini**: ~$0.00015 per short response

Example: 5-minute survey with 5 questions ≈ $0.10-0.15

---

## Next Steps

- Add authentication for surveyors
- Implement call recording
- Add survey analytics dashboard
- Support for branching logic
- Email notifications on survey completion
- Export to CSV/Excel

---

## Support

For issues or questions:
- Check the Twilio documentation: https://www.twilio.com/docs
- OpenAI API docs: https://platform.openai.com/docs
- ElevenLabs docs: https://docs.elevenlabs.io/

Happy Surveying! 🎉
