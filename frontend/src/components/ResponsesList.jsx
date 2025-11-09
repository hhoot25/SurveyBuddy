import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

function ResponsesList() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch(`${API_URL}/responses`);
      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }
      const data = await response.json();
      setResponses(data);
    } catch (err) {
      console.error('Error fetching responses:', err);
      setError('Failed to load responses');
    } finally {
      setLoading(false);
    }
  };

  const downloadResponse = async (responseId) => {
    try {
      const response = await fetch(`${API_URL}/responses/${responseId}/download`);
      if (!response.ok) {
        throw new Error('Failed to download response');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `survey-response-${responseId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading response:', err);
      alert('Failed to download response');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-600 text-center py-12">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Survey Responses</h2>
        <button
          onClick={fetchResponses}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-lg">No responses yet</p>
          <p className="text-sm mt-2">Create a survey and make a call to see responses here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => (
            <div
              key={response._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">
                      Phone: {response.phoneNumber}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      response.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {response.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(response.createdAt).toLocaleString()}
                  </p>
                  {response.callSid && (
                    <p className="text-xs text-gray-400 mt-1">
                      Call SID: {response.callSid}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => downloadResponse(response._id)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download JSON
                </button>
              </div>

              {/* Q&A Pairs */}
              {response.qaPairs && response.qaPairs.length > 0 && (
                <div className="space-y-3 mt-4">
                  {response.qaPairs.map((qa, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-indigo-900 mb-1">
                        Q{index + 1}: {qa.question}
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Answer:</span> {qa.answer}
                      </p>
                      {qa.aiResponse && (
                        <p className="text-sm text-blue-600 italic">
                          <span className="font-medium">AI:</span> {qa.aiResponse}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {response.qaPairs && response.qaPairs.length === 0 && (
                <p className="text-sm text-gray-500 italic">No responses recorded yet</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResponsesList;
