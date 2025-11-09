require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const Survey = require('./models/Survey');
const Response = require('./models/Response');
const { initiateCall, VoiceResponse } = require('./services/twilioService');
const { generateAIResponse } = require('./services/openaiService');
const { generateSpeechUrl } = require('./services/elevenlabsService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Store active call sessions in memory (in production, use Redis or similar)
const callSessions = new Map();

// API Routes

// Create a new survey
app.post('/api/surveys', async (req, res) => {
  try {
    const { questions, phoneNumber } = req.body;
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Questions array is required' });
    }
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    const survey = new Survey({ questions, phoneNumber });
    await survey.save();
    
    res.status(201).json({ 
      message: 'Survey created successfully', 
      surveyId: survey._id 
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ error: 'Failed to create survey' });
  }
});

// Get all surveys
app.get('/api/surveys', async (req, res) => {
  try {
    const surveys = await Survey.find().sort({ createdAt: -1 });
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Failed to fetch surveys' });
  }
});

// Initiate a call for a survey
app.post('/api/surveys/:id/call', async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({ error: 'Survey not found' });
    }
    
    // Create a response document to track this call
    const response = new Response({
      surveyId: survey._id,
      phoneNumber: survey.phoneNumber,
      qaPairs: []
    });
    await response.save();
    
    // Get the base URL for webhooks (you'll need to use ngrok URL for production)
    const baseUrl = req.body.webhookBaseUrl || `http://localhost:${PORT}`;
    const webhookUrl = `${baseUrl}/api/webhook/voice?surveyId=${survey._id}&responseId=${response._id}`;
    
    // Initiate the call
    const callSid = await initiateCall(survey.phoneNumber, webhookUrl, baseUrl);
    
    // Update response with call SID
    response.callSid = callSid;
    await response.save();
    
    res.json({ 
      message: 'Call initiated successfully', 
      callSid,
      responseId: response._id 
    });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
});

// Get all responses
app.get('/api/responses', async (req, res) => {
  try {
    const responses = await Response.find()
      .populate('surveyId')
      .sort({ createdAt: -1 });
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Download response as JSON
app.get('/api/responses/:id/download', async (req, res) => {
  try {
    const response = await Response.findById(req.params.id).populate('surveyId');
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    // Format the data for download
    const downloadData = {
      surveyId: response.surveyId._id,
      phoneNumber: response.phoneNumber,
      timestamp: response.createdAt,
      completed: response.completed,
      qaPairs: response.qaPairs.map(qa => ({
        question: qa.question,
        answer: qa.answer
      }))
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=survey-response-${response._id}.json`);
    res.json(downloadData);
  } catch (error) {
    console.error('Error downloading response:', error);
    res.status(500).json({ error: 'Failed to download response' });
  }
});

// Twilio Webhook - Voice call handler
app.post('/api/webhook/voice', async (req, res) => {
  try {
    const { surveyId, responseId } = req.query;
    const { SpeechResult, CallSid } = req.body;
    
    const survey = await Survey.findById(surveyId);
    const response = await Response.findById(responseId);
    
    if (!survey || !response) {
      return res.status(404).send('Survey or Response not found');
    }
    
    const twiml = new VoiceResponse();
    
    // Initialize or get session state
    let session = callSessions.get(CallSid) || { 
      currentQuestionIndex: 0, 
      responseId 
    };
    
    // If we have speech result, process it
    if (SpeechResult) {
      const currentQuestion = survey.questions[session.currentQuestionIndex - 1];
      
      // Generate AI response
      const aiResponse = await generateAIResponse(SpeechResult, currentQuestion);
      
      // Save Q&A pair
      response.qaPairs.push({
        question: currentQuestion,
        answer: SpeechResult,
        aiResponse: aiResponse
      });
      await response.save();
      
      // Generate and play AI response using ElevenLabs
      const aiAudioFilename = `ai-response-${CallSid}-${Date.now()}.mp3`;
      const aiAudioUrl = await generateSpeechUrl(aiResponse, aiAudioFilename);
      
      // Get base URL for audio playback
      const baseUrl = req.protocol + '://' + req.get('host');
      twiml.play(`${baseUrl}${aiAudioUrl}`);
      twiml.pause({ length: 1 });
    }
    
    // Check if there are more questions
    if (session.currentQuestionIndex < survey.questions.length) {
      const nextQuestion = survey.questions[session.currentQuestionIndex];
      
      // Generate audio for the question using ElevenLabs
      const questionAudioFilename = `question-${CallSid}-${session.currentQuestionIndex}-${Date.now()}.mp3`;
      const questionAudioUrl = await generateSpeechUrl(nextQuestion, questionAudioFilename);
      
      // Get base URL for audio playback
      const baseUrl = req.protocol + '://' + req.get('host');
      
      // Gather speech response
      twiml.gather({
        input: 'speech',
        action: `/api/webhook/voice?surveyId=${surveyId}&responseId=${responseId}`,
        method: 'POST',
        speechTimeout: 'auto',
        speechModel: 'experimental_conversations'
      }).play(`${baseUrl}${questionAudioUrl}`);
      
      // Update session
      session.currentQuestionIndex++;
      callSessions.set(CallSid, session);
    } else {
      // All questions answered - generate goodbye message using ElevenLabs
      const goodbyeAudioFilename = `goodbye-${CallSid}-${Date.now()}.mp3`;
      const goodbyeAudioUrl = await generateSpeechUrl('Thank you for completing the survey. Goodbye!', goodbyeAudioFilename);
      
      // Get base URL for audio playback
      const baseUrl = req.protocol + '://' + req.get('host');
      twiml.play(`${baseUrl}${goodbyeAudioUrl}`);
      twiml.hangup();
      
      // Mark response as completed
      response.completed = true;
      await response.save();
      
      // Clean up session
      callSessions.delete(CallSid);
    }
    
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Error in voice webhook:', error);
    const twiml = new VoiceResponse();
    twiml.say({ voice: 'Polly.Joanna' }, 'Sorry, an error occurred. Please try again later.');
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Call status callback
app.post('/api/webhook/voice/status', (req, res) => {
  console.log('Call status:', req.body);
  res.sendStatus(200);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Make sure to set up ngrok or expose this server publicly for Twilio webhooks');
});
