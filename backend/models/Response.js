const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  qaPairs: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    aiResponse: {
      type: String
    }
  }],
  callSid: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Response', responseSchema);
