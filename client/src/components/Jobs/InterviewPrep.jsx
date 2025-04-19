import React, { useState, useEffect } from 'react';

const InterviewPrep = () => {
  const [loading, setLoading] = useState(true);
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch interview data from Flask backend
    const fetchInterviewData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/interview');
        const data = await response.json();
        setInterview(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching interview data:', error);
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, []);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    
    setSubmitting(true);
    try {
      // Send user answer to backend for evaluation
      const response = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: interview.questions[currentQuestionIndex].id,
          answer: userAnswer
        }),
      });
      
      const feedbackData = await response.json();
      setFeedback(feedbackData);
      
      // Check if this was the last question
      if (currentQuestionIndex === interview.questions.length - 1) {
        setInterviewComplete(true);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setFeedback(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-red-500">Error</h1>
          <p className="mt-4">Failed to load interview data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{interview.position}</h1>
              <p className="text-gray-600 mt-1">{interview.company}</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              {interview.difficulty} Level
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-3">
            {interview.skills && interview.skills.map((skill, index) => (
              <span 
                key={index} 
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-gray-500">Duration</div>
                <div className="font-medium mt-1">{interview.duration} minutes</div>
              </div>
              <div>
                <div className="text-gray-500">Questions</div>
                <div className="font-medium mt-1">{interview.questions.length} total</div>
              </div>
              <div>
                <div className="text-gray-500">Progress</div>
                <div className="font-medium mt-1">
                  {currentQuestionIndex + 1} of {interview.questions.length}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestionIndex + 1) / interview.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Interview Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {interviewComplete ? (
            <div className="text-center py-8">
              <svg 
                className="mx-auto h-16 w-16 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Interview Complete!</h2>
              <p className="mt-2 text-gray-600">
                Thank you for completing this mock interview. You can view your overall performance in the dashboard.
              </p>
              <button 
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                View Results
              </button>
            </div>
          ) : (
            <>
              {/* Current Question */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Question {currentQuestionIndex + 1}:
                </h2>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-gray-800">
                    {interview.questions[currentQuestionIndex].question}
                  </p>
                </div>
              </div>
              
              {/* Answer Section */}
              {!feedback ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Your Answer:</h3>
                  <textarea
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32"
                    placeholder="Type your answer here..."
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={submitting}
                  ></textarea>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      className={`px-6 py-2 rounded-lg font-medium ${
                        submitting 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      onClick={handleSubmitAnswer}
                      disabled={submitting || !userAnswer.trim()}
                    >
                      {submitting ? 'Submitting...' : 'Submit Answer'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Your Answer:</h3>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700">{userAnswer}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">AI Feedback:</h3>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          <div className="bg-green-500 rounded-full p-1">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-700">Strengths</h4>
                          <ul className="mt-2 ml-5 list-disc text-gray-700">
                            {feedback.strengths.map((strength, index) => (
                              <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex items-start mt-4">
                        <div className="mr-3 mt-1">
                          <div className="bg-amber-500 rounded-full p-1">
                            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-amber-700">Areas to Improve</h4>
                          <ul className="mt-2 ml-5 list-disc text-gray-700">
                            {feedback.improvements.map((improvement, index) => (
                              <li key={index}>{improvement}</li>
                            ))}
                          </ul>
                        </div>  
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <h4 className="font-medium text-gray-800">Overall Score</h4>
                        <div className="flex items-center mt-2">
                          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`absolute top-0 left-0 h-full rounded-full ${
                                feedback.score >= 80 ? 'bg-green-500' : 
                                feedback.score >= 60 ? 'bg-blue-500' : 
                                feedback.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${feedback.score}%` }}
                            ></div>
                          </div>
                          <span className="ml-3 font-bold text-gray-700">{feedback.score}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Sample Answer:</h3>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-gray-700">{feedback.sampleAnswer}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                      onClick={handleNextQuestion}
                    >
                      {currentQuestionIndex < interview.questions.length - 1 ? 'Next Question' : 'Complete Interview'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;