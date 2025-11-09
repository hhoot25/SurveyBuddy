const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Generate speech from text using ElevenLabs
async function generateSpeech(text, outputPath) {
  try {
    const response = await axios({
      method: 'post',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      responseType: 'arraybuffer'
    });

    // Save audio file
    fs.writeFileSync(outputPath, response.data);
    return outputPath;
  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error.response?.data || error.message);
    throw error;
  }
}

// Generate speech and return URL for Twilio
async function generateSpeechUrl(text, filename) {
  const outputDir = path.join(__dirname, '../public/audio');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, filename);
  await generateSpeech(text, outputPath);
  
  // Return relative URL path that Twilio can access
  return `/audio/${filename}`;
}

module.exports = {
  generateSpeech,
  generateSpeechUrl
};
