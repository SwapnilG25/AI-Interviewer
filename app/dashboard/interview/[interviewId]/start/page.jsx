'use client';
import React, { useEffect, useState, use } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '@/utils/schema';
import QuestionsSection from './_components/QuestionsSection';

// ✅ Dynamically import RecordAnswerSection with SSR disabled
import dynamic from 'next/dynamic';
const RecordAnswerSection = dynamic(() => import('./_components/RecordAnswerSection'), {
  ssr: false,
});

function StartInterview({ params }) {
  const resolvedParams = use(params);

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (resolvedParams?.interviewId) {
      GetInterviewDetails(resolvedParams.interviewId);
    } else {
      setError('No interview ID provided');
      setLoading(false);
    }
  }, [resolvedParams?.interviewId]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (!result || result.length === 0) {
        setError(`No interview found with ID: ${interviewId}`);
        setLoading(false);
        return;
      }

      if (!result[0].jsonMockResp) {
        setError('Interview found but no questions available');
        setLoading(false);
        return;
      }

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);

      const questions = Array.isArray(jsonMockResp)
        ? jsonMockResp
        : jsonMockResp.interviewQuestions || [];

      console.log("Extracted questions:", questions);
      setMockInterviewQuestions(questions);
      setInterviewData(result[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setError('Failed to load interview details');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-5">Loading interview...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        <QuestionsSection 
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection />
      </div>
    </div>
  );
}

export default StartInterview;
