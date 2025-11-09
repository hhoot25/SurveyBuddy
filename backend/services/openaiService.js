const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Transcribe audio using Whisper
async function transcribeAudio(audioFilePath) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-1'
    });
    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

// Generate AI response using GPT
async function generateAIResponse(userAnswer, question) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly and empathetic surveyor AI. Your job is to provide short, comforting responses to survey answers. Keep responses under 20 words. Be supportive and encouraging.'
        },
        {
          role: 'user',
          content: `The survey question was: "${question}"\nThe person answered: "${userAnswer}"\n\nProvide a brief, supportive response (under 20 words).`
        }
      ],
      max_tokens: 50,
      temperature: 0.7
    });
    
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

module.exports = {
  transcribeAudio,
  generateAIResponse
};
