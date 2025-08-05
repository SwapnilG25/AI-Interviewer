"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession, getInterviewQuestionsWithAnswers } from '../../../utils/GeminiAIModal';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [jobPosition, setJobPosition] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExperience, setJobExperience] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [interviewData, setInterviewData] = useState(null);
    const [jsonResponse, setJsonResponse] = useState(null);
    const { user } = useUser();
    const router=useRouter();

    const onSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDesc, jobExperience);

        const InputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDesc}, Years of Experience: ${jobExperience}. Based on these, give ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions and answers in strict JSON format wrapped in \`\`\`json ... \`\`\``;

        try {
            const result = await chatSession.sendMessage(InputPrompt);
            const rawText = await result.response.text();

            // Extract clean JSON from markdown block
            const jsonMatch = rawText.match(/```json([\s\S]*?)```/);

            if (!jsonMatch || !jsonMatch[1]) {
                throw new Error("No valid JSON block found in AI response");
            }

            const cleanedJson = jsonMatch[1].trim();
            const parsedJson = JSON.parse(cleanedJson); // This is now safe
            console.log("✅ Parsed JSON:", parsedJson);

            setJsonResponse(parsedJson);
            setInterviewData(parsedJson); // Display to user

            const resp = await db.insert(MockInterview).values({
                mockId: uuidv4(),
                jsonMockResp: JSON.stringify(parsedJson), // store safely as string
                jobPosition,
                jobDesc,
                jobExperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-YYYY')
            }).returning({ mockId: MockInterview.mockId });

            console.log("Inserted ID:", resp);
            if(resp)
            {
                setOpenDialog(false);
                router.push('/dashboard/interview/'+resp[0]?.mockId);
            }
        } catch (err) {
            console.error("❌ Error during AI response handling:", err);
            setError("Something went wrong while processing the response.");
        }

        setLoading(false);
    };


    return (
        <div>
            <div
                className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='font-bold text-lg text-center'>+ Add New</h2>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Tell us more about your job interviewing
                        </DialogTitle>

                        <DialogDescription>
                            Add details about your job position/role, job description and years of experience.
                            <br />
                            <strong>Note:</strong> The AI will generate {process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || '5'} questions.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit}>
                        <div className='mt-7 my-3'>
                            <label>Job Role/Job Position</label>
                            <Input
                                placeholder="Ex. Full Stack Developer"
                                required
                                onChange={(event) => setJobPosition(event.target.value)}
                                value={jobPosition}
                            />
                        </div>

                        <div className='my-3'>
                            <label>Job Description/ Tech Stack (In Short)</label>
                            <Textarea
                                placeholder="Ex. React, Angular, Node.js, MySql etc"
                                required
                                onChange={(event) => setJobDesc(event.target.value)}
                                value={jobDesc}
                            />
                        </div>

                        <div className='my-3'>
                            <label>Years of experience</label>
                            <Input
                                placeholder="Ex.5"
                                type="number"
                                max="50"
                                required
                                onChange={(event) => setJobExperience(event.target.value)}
                                value={jobExperience}
                            />
                        </div>

                        <div className='flex gap-5 justify-end'>
                            <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Generating...' : 'Start Interview'}
                            </Button>
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </form>
                </DialogContent>
            </Dialog>

            {loading && (
                <div className="text-center mt-4 text-blue-600 font-semibold">
                    Generating your interview questions, please wait...
                </div>
            )}

            {interviewData && !loading && (
                <div className="mt-8 p-4 border rounded-lg bg-white shadow-md">
                    <h2 className="text-xl font-bold mb-4">Your Interview Questions:</h2>
                    {Array.isArray(interviewData) && interviewData.map((item, index) => (
                        <div key={index} className="mb-4 p-3 border-b last:border-b-0">
                            <h3 className="font-semibold text-lg">Question {index + 1}: {item.question}</h3>
                            <p className="text-gray-700 whitespace-pre-wrap mt-1"><strong>Answer:</strong> {item.answer}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AddNewInterview;
