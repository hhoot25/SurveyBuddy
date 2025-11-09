const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  questions: {
    type: [String],
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Survey', surveySchema);
