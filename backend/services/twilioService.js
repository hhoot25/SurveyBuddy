const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initiate an outbound call
async function initiateCall(toPhoneNumber, webhookUrl, baseUrl) {
  try {
    const call = await client.calls.create({
      to: toPhoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: webhookUrl,
      method: 'POST',
      statusCallback: `${baseUrl}/api/webhook/voice/status`,
      statusCallbackMethod: 'POST'
    });
    
    return call.sid;
  } catch (error) {
    console.error('Error initiating call:', error);
    throw error;
  }
}

// Validate Twilio request signature (for security)
function validateRequest(request) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioSignature = request.headers['x-twilio-signature'];
  const url = request.protocol + '://' + request.get('host') + request.originalUrl;
  
  return twilio.validateRequest(authToken, twilioSignature, url, request.body);
}

module.exports = {
  initiateCall,
  validateRequest,
  VoiceResponse: twilio.twiml.VoiceResponse
};
