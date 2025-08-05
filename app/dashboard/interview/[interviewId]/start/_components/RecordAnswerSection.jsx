"use client";
import { Button } from "@/components/ui/button";
import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";

function RecordAnswerSection() {
  const webcamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    const filteredResults = results
      .map((r) => r.transcript)
      .filter(
        (t) =>
          t.toLowerCase().trim() !==
          "you want to answer the question and exact question"
      );

    const finalTranscript = filteredResults.join(" ");
    setUserAnswer(finalTranscript);
  }, [results]);

  useEffect(() => {
    const checkCamera = setInterval(() => {
      if (webcamRef.current && webcamRef.current.video?.readyState === 4) {
        setCameraOn(true);
        clearInterval(checkCamera);
      }
    }, 300);
    return () => clearInterval(checkCamera);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center bg-black rounded-2xl p-6 space-y-4 shadow-xl w-full max-w-md mx-auto relative my-10">
        {!cameraOn && (
          <img
            src="/webcam.png"
            alt="Webcam placeholder"
            className="absolute w-[200px] h-[300px] object-contain opacity-60 z-10"
          />
        )}
        <Webcam
          ref={webcamRef}
          audio={false}
          height={300}
          width={400}
          className={`rounded-xl transition-opacity duration-500 ${
            cameraOn ? "opacity-100" : "opacity-0"
          }`}
          videoConstraints={{
            width: 400,
            height: 300,
            facingMode: "user",
          }}
        />
      </div>

      <Button
        className="my-15  bg-blue-600 hover:bg-red-700 text-white"
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
      >
        {isRecording ? (
          <h2 className="text-red-800 flex gap-2">
            <Mic className="inline-block mr-2" /> Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>

      <Button
        className="my-10 bg-blue-600 hover:bg-red-700 text-white"
        onClick={() => console.log(userAnswer)}
      >
        Show User Answer
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
