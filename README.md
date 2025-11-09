# SurveyBuddy 🎤📞

An AI-powered phone survey system that conducts empathetic, conversational surveys over the phone using advanced AI technologies.

## Features

✨ **AI-Powered Conversations**: Uses OpenAI's GPT to generate empathetic, contextual responses to survey answers
🎯 **Automated Phone Calls**: Twilio integration for automated outbound survey calls
🗣️ **Natural Voice**: ElevenLabs text-to-speech for personalized, natural-sounding voice
👂 **Speech Recognition**: OpenAI Whisper for accurate transcription of spoken responses
📊 **Easy Management**: Web interface to create surveys, initiate calls, and download responses
💾 **JSON Export**: Download survey responses in JSON format for easy analysis

## Tech Stack

### Backend
- **Node.js + Express**: RESTful API server
- **MongoDB + Mongoose**: Database for surveys and responses
- **Twilio**: Programmable voice for phone calls
- **OpenAI**: Whisper (transcription) + GPT-4o-mini (AI responses)
- **ElevenLabs**: Text-to-speech for natural voice

### Frontend
- **React + Vite**: Modern, fast web interface
- **Tailwind CSS**: Beautiful, responsive UI
- **Fetch API**: Communication with backend

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/hhoot25/SurveyBuddy.git
   cd SurveyBuddy
   ```

2. **Set up environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Start services**
   ```bash
   # Terminal 1: MongoDB
   mongod

   # Terminal 2: Backend
   cd backend
   node server.js

   # Terminal 3: Frontend
   cd frontend
   npm run dev

   # Terminal 4: ngrok (for Twilio webhooks)
   ngrok http 3001
   ```

5. **Open the app**
   - Navigate to http://localhost:5173/
   - Create a survey, add questions, and make a call!

📖 **For detailed setup instructions, see [SETUP.md](SETUP.md)**

## How It Works

1. **Surveyor creates a survey** with custom questions via the web interface
2. **System initiates a call** to the specified phone number using Twilio
3. **AI asks questions** using natural-sounding voice from ElevenLabs or Twilio TTS
4. **Recipient responds** verbally to each question
5. **Speech is transcribed** using OpenAI Whisper
6. **AI generates empathetic response** using GPT based on the answer
7. **Process repeats** for all questions in linear fashion
8. **Responses are saved** to MongoDB with Q&A pairs
9. **Surveyor downloads** responses as JSON from the web interface

## Project Structure

```
SurveyBuddy/
├── backend/
│   ├── models/
│   │   ├── Survey.js          # Survey schema
│   │   └── Response.js        # Response schema
│   ├── services/
│   │   ├── openaiService.js   # Whisper & GPT integration
│   │   ├── elevenlabsService.js # TTS integration
│   │   └── twilioService.js   # Phone call integration
│   ├── server.js              # Express server & API routes
│   ├── .env.example           # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateSurvey.jsx    # Survey creation form
│   │   │   └── ResponsesList.jsx   # Responses viewer
│   │   ├── App.jsx            # Main app component
│   │   └── index.css          # Tailwind styles
│   ├── tailwind.config.js
│   └── package.json
├── SETUP.md                   # Detailed setup guide
└── README.md                  # This file
```

## API Endpoints

### Surveys
- `POST /api/surveys` - Create a new survey
- `GET /api/surveys` - Get all surveys
- `POST /api/surveys/:id/call` - Initiate a call for a survey

### Responses
- `GET /api/responses` - Get all responses
- `GET /api/responses/:id/download` - Download response as JSON

### Webhooks
- `POST /api/webhook/voice` - Twilio voice webhook (handles call flow)

## Configuration

Required environment variables (in `backend/.env`):

```env
MONGODB_URI=mongodb://localhost:27017/surveybuddy
OPENAI_API_KEY=your-key
ELEVENLABS_API_KEY=your-key
ELEVENLABS_VOICE_ID=voice-id
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
PORT=3001
```

## Development

- **Backend**: `cd backend && node server.js` (or `npm run dev` with nodemon)
- **Frontend**: `cd frontend && npm run dev`
- **Database**: Ensure MongoDB is running
- **Webhooks**: Use ngrok for local development

## Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Survey analytics dashboard
- [ ] Branching survey logic (conditional questions)
- [ ] Call recording and playback
- [ ] Email notifications on survey completion
- [ ] CSV/Excel export
- [ ] Scheduled surveys
- [ ] Voice customization per survey

## Contributing

This project was created for HackUTD 2025. Contributions and suggestions are welcome!

## License

MIT

## Acknowledgments

- Built with ❤️ for HackUTD 2025
- Powered by Twilio, OpenAI, and ElevenLabs

---

**Happy Surveying!** 🎉
