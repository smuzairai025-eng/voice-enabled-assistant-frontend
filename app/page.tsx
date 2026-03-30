"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, PlayCircle, Loader2, AlertCircle, Info } from "lucide-react";

type Responses = {
  gemini: string;
  openai: string; 
  kimi: string;
};

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<Responses | null>(null);
  const [error, setError] = useState("");
  
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true; 
        recognitionRef.current.interimResults = true; 

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
      } else {
        setError("Speech Recognition is not supported in this browser. Please use Google Chrome.");
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      setResponses(null);
      setError("");
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleFetchResponses = async () => {
    if (!transcript) return;
    
    setIsLoading(true);
    setError("");
    setResponses(null);

    try {
      const res = await fetch("https://voice-enabled-multimodel-assistant-production.up.railway.app/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: transcript }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch responses from the server.");
      }

      const data = await res.json();
      setResponses(data.responses);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-3 md:space-y-4 pt-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Sunmarke AI Voice Assistant</h1>
          <p className="text-sm md:text-base text-gray-600 px-2">Ask a question using your voice to get answers from 3 different AI models.</p>
        </header>

        {/* Recording Section */}
        <section className="flex flex-col items-center space-y-5 md:space-y-6 bg-white p-5 md:p-8 rounded-xl shadow-sm border border-gray-100">
          
          {/* Instructions Panel */}
          <div className="bg-blue-50/80 border border-blue-100 rounded-lg p-4 w-full max-w-2xl text-left">
            <h3 className="font-semibold text-blue-800 flex items-center gap-2 mb-2 text-sm md:text-base">
              <Info size={18} /> How to use:
            </h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm md:text-base ml-1">
              <li>Click the microphone icon to start recording.</li>
              <li>Speak your query clearly.</li>
              <li>Click the microphone again to stop recording.</li>
              <li>Click the <strong>Send Query to AI Agents</strong> button to generate responses.</li>
            </ol>
          </div>

          <button
            onClick={toggleRecording}
            className={`p-5 md:p-6 rounded-full transition-all duration-300 ${
              isRecording 
                ? "bg-red-100 text-red-600 animate-pulse hover:bg-red-200 shadow-lg scale-105" 
                : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-105"
            }`}
          >
            {isRecording ? <MicOff size={28} className="md:w-8 md:h-8" /> : <Mic size={28} className="md:w-8 md:h-8" />}
          </button>
          
          <div className="text-center w-full max-w-2xl">
            <h3 className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Transcribed Query</h3>
            <div className="min-h-[80px] p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 text-base md:text-lg shadow-inner text-left md:text-center">
              {transcript || <span className="text-gray-400 italic">Click the microphone, allow permissions, and start speaking...</span>}
            </div>
          </div>

          <button 
            onClick={handleFetchResponses}
            disabled={!transcript || isRecording || isLoading}
            className="w-full md:w-auto px-6 md:px-8 py-3 bg-gray-900 text-white text-sm md:text-base font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors shadow-md"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18}/> Processing...</span>
            ) : (
              "Send Query to AI Agents"
            )}
          </button>

          {error && (
            <div className="flex items-start md:items-center text-red-600 bg-red-50 px-4 py-3 rounded-lg w-full max-w-2xl border border-red-100 text-sm md:text-base">
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5 md:mt-0" />
              <p>{error}</p>
            </div>
          )}
        </section>

        {/* 3-Column Responses Section */}
        {(isLoading || responses) && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-2 md:pt-4">
            {[
              { id: 'gemini', name: 'Gemini (Google)', color: 'bg-emerald-50 border-emerald-200', textColor: 'text-emerald-800' },
              { id: 'openai', name: 'OpenAI', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-800' },
              { id: 'kimi', name: 'Kimi (Moonshot)', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-800' }
            ].map((model) => (
              <div key={model.id} className={`flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md ${model.color}`}>
                <div className="p-3 md:p-4 border-b bg-white/60 flex justify-between items-center backdrop-blur-sm">
                  <h3 className={`font-bold text-sm md:text-base ${model.textColor}`}>{model.name}</h3>
                  {responses && responses[model.id as keyof Responses] && (
                    <button 
                      onClick={() => playAudio(responses[model.id as keyof Responses])}
                      className="text-gray-600 hover:text-black hover:bg-black/5 px-2 md:px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs md:text-sm font-medium"
                      title={`Play ${model.name} response`}
                    >
                      <PlayCircle size={16} /> <span className="hidden sm:inline">Listen</span>
                    </button>
                  )}
                </div>
                
                <div className="p-4 md:p-6 flex-grow overflow-y-auto max-h-[350px] md:max-h-[500px] bg-white/40">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 py-8 md:py-12">
                      <Loader2 size={28} className="animate-spin text-gray-300" />
                      <p className="text-xs md:text-sm font-medium">Generating response...</p>
                    </div>
                  ) : (
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                      {responses?.[model.id as keyof Responses] || "No response generated."}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
        
      </div>
    </main>
  );
}