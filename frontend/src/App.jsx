import { useState, useEffect } from 'react';
import CreateSurvey from './components/CreateSurvey';
import ResponsesList from './components/ResponsesList';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            SurveyBuddy
          </h1>
          <p className="text-gray-600">AI-Powered Phone Survey System</p>
        </header>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex gap-4 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'create'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Survey
            </button>
            <button
              onClick={() => setActiveTab('responses')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'responses'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              View Responses
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'create' ? (
            <CreateSurvey />
          ) : (
            <ResponsesList />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
