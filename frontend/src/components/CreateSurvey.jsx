import { useState } from 'react';

const API_URL = 'http://localhost:3001/api';

function CreateSurvey() {

  const [phoneNumber, setPhoneNumber] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ngrokUrl, setNgrokUrl] = useState('https://finn-overspeedy-noriko.ngrok-free.dev');

  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Filter out empty questions
      const validQuestions = questions.filter(q => q.trim() !== '');

      if (validQuestions.length === 0) {
        setMessage('Please add at least one question');
        setLoading(false);
        return;
      }

      if (!phoneNumber.trim()) {
        setMessage('Please enter a phone number');
        setLoading(false);
        return;
      }

      // Create survey
      const surveyResponse = await fetch(`${API_URL}/surveys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: validQuestions,
          phoneNumber: phoneNumber,
        }),
      });

      if (!surveyResponse.ok) {
        throw new Error('Failed to create survey');
      }

      const surveyData = await surveyResponse.json();
      
      // Initiate call
      const callResponse = await fetch(`${API_URL}/surveys/${surveyData.surveyId}/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          webhookBaseUrl: ngrokUrl || undefined,
        }),
      });

      if (!callResponse.ok) {
        throw new Error('Failed to initiate call');
      }

      const callData = await callResponse.json();
      setMessage(`✅ Call initiated successfully! Call SID: ${callData.callSid}`);
      
      // Reset form
      setPhoneNumber('');
      setQuestions(['']);
    } catch (error) {
      console.error('Error:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Survey</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded-lg ${
          message.startsWith('✅') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (with country code, e.g., +1234567890)
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1234567890"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        {/* Ngrok URL (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngrok URL (optional - for Twilio webhooks)
          </label>
          <input
            type="url"
            value={ngrokUrl}
            onChange={(e) => setNgrokUrl(e.target.value)}
            placeholder="https://your-ngrok-url.ngrok.io"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            If you're using ngrok for webhooks, enter the URL here
          </p>
        </div>

        {/* Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Survey Questions
          </label>
          {questions.map((question, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder={`Question ${index + 1}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            + Add Question
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating Survey & Initiating Call...' : 'Create Survey & Make Call'}
        </button>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 How it works:</h3>
        <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
          <li>Enter the phone number to call</li>
          <li>Add your survey questions</li>
          <li>Click to create and initiate the call</li>
          <li>The AI will ask questions and respond empathetically</li>
          <li>View responses in the "View Responses" tab</li>
        </ol>
      </div>
    </div>
  );
}

export default CreateSurvey;
