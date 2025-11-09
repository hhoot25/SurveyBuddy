# Quick Start Guide - SurveyBuddy

## ⚡ Get Up and Running in 5 Minutes!

### Step 1: Add Your API Keys
Edit `backend/.env` with your actual API keys:

```env
OPENAI_API_KEY=sk-your-actual-key-here
ELEVENLABS_API_KEY=your-actual-key-here
TWILIO_ACCOUNT_SID=your-actual-sid-here
TWILIO_AUTH_TOKEN=your-actual-token-here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 2: Start MongoDB
Open a new terminal and run:
```bash
mongod
```

### Step 3: Start Backend
Open a new terminal and run:
```bash
cd backend
node server.js
```

You should see:
```
Connected to MongoDB
Server running on port 3001
```

### Step 4: Frontend (Already Running!)
The frontend is already running at http://localhost:5173/
If not, run:
```bash
cd frontend
npm run dev
```

### Step 5: Set Up ngrok (For Phone Calls)
Open a new terminal and run:
```bash
ngrok http 3001
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 6: Make Your First Call!
1. Open http://localhost:5173/
2. Enter a phone number (must be verified in Twilio for trial accounts)
3. Paste your ngrok URL in the "Ngrok URL" field
4. Add survey questions
5. Click "Create Survey & Make Call"

## 🎯 Important Notes

### Twilio Trial Account Limitations
- You can only call **verified phone numbers**
- Go to Twilio Console → Phone Numbers → Verified Caller IDs
- Add and verify your phone number before testing

### ngrok Tips
- Free ngrok URLs expire after 2 hours
- Keep the ngrok terminal running during testing
- Update the URL in the webapp if you restart ngrok

### Testing Locally
For initial testing WITHOUT making real calls:
- You can create surveys and view the UI
- Test the backend API with tools like Postman
- Only make actual calls when you have all services configured

## 📞 Sample Survey Questions

Try these for your first survey:
1. "How would you rate your experience today from 1 to 10?"
2. "What did you like most about our service?"
3. "Is there anything we could improve?"

The AI will respond empathetically to each answer!

## 🆘 Quick Troubleshooting

**Backend won't start?**
- Check if MongoDB is running
- Verify .env file has correct values

**Call not working?**
- Verify phone number in Twilio console
- Check ngrok is running and URL is correct
- Look at Twilio console logs for errors

**Frontend not connecting?**
- Make sure backend is running on port 3001
- Check browser console for CORS errors

---

For detailed documentation, see [SETUP.md](SETUP.md)

Happy Surveying! 🎉
