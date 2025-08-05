"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { MockInterview } from '@/utils/schema';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Interview() {
  const params = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params?.interviewId) {
      setError('No interview ID provided');
      setLoading(false);
      return;
    }

    console.log(params.interviewId);
    GetInterviewDetails(params.interviewId);
  }, [params?.interviewId]);

  const GetInterviewDetails = async (interviewId) => {
    try {
      setLoading(true);
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      // ✅ FIXED: Add safety checks
      if (!result || result.length === 0) {
        setError(`No interview found with ID: ${interviewId}`);
        setLoading(false);
        return;
      }

      setInterviewData(result[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching interview details:', error);
      setError('Failed to load interview details');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-5">Loading interview details...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">Error: {error}</div>;
  }

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-3xl'>Let's Get Started</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 '>

        <div className='flex flex-col my-5 gap-5'>
          <div className='flex flex-col p-5 rounded-lg border gap-5'>
            <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData?.jobPosition} </h2>
            <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData?.jobDesc} </h2>
            <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData?.jobExperience} </h2>
          </div>
          <div className='p-5 rounded-lg border-yellow-300 border bg-yellow-100'>
            <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
            <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center'>
          {webcamEnabled ? <Webcam
            onUserMedia={() => setWebcamEnabled(true)}
            onUserMediaError={() => setWebcamEnabled(false)}
            mirrored={true}
            style={{ width: 300, height: 300 }}
          />
            :
            <><WebcamIcon className='h-72 w-full my-5 p-20 bg-secondary rounded-lg border ' />
              <Button
                variant="outline"
                className="w-full px-6 py-3 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 text-black font-semibold shadow-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl"
                onClick={() => setWebcamEnabled(true)}
              >
                🎥 Enable Webcam & 🎤 Microphone
              </Button>
            </>
          }
        </div>
      </div>

      <div className='flex justify-end mt-10 hover:scale-105 transition-all duration-300'>
        <Link href={`/dashboard/interview/${params.interviewId}/start`}>
          <Button disabled={!interviewData}>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}

export default Interview;