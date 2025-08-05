import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {
  const speakQuestion = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  return mockInterviewQuestions && (
    <div className="p-5 border rounded-lg shadow-sm w-full max-w-4xl mx-auto my-10 ">
      <h2 className="text-lg font-bold mb-4">Interview Questions</h2>
      {Array.isArray(mockInterviewQuestions) && mockInterviewQuestions.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            {mockInterviewQuestions.map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 backdrop-blur-sm ${
                  activeQuestionIndex == index 
                    ? 'bg-gradient-to-r from-pink-500/80 to-violet-500/80 text-white font-bold shadow-xl transform scale-105 border border-white/20' 
                    : 'bg-gray-100/80 hover:bg-gray-200/80 shadow-sm border border-gray-200'
                }`}
              >
                {activeQuestionIndex == index && <span className="mr-1">🎯</span>}
                Question #{index + 1}
              </button>
            ))}
          </div>

          <div className="mb-2">
            <h2 className="text-lg font-semibold">{mockInterviewQuestions[activeQuestionIndex]?.question}</h2>
            <button 
              onClick={() => speakQuestion(mockInterviewQuestions[activeQuestionIndex]?.question)} 
              className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              <span className="text-sm">Speak Question</span>
            </button>
          </div>

          <div className='border rounded-lg p-4 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-primary'>
              <Lightbulb />
              <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-gray-600 my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-32 w-full text-gray-500 text-sm">
          No questions available
        </div>
      )}
    </div>
  );
}

export default QuestionsSection;
