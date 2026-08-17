import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceInputButton: React.FC<{ onResult: (text: string) => void }> = ({ onResult }) => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        onResult("I had a bowl of oatmeal with almonds and a glass of milk.");
        setIsRecording(false);
      }, 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleRecording}
      className={`p-3.5 rounded-full flex items-center justify-center transition-all shadow-sm ${
        isRecording 
          ? 'bg-rose-100 text-rose-600 ring-4 ring-rose-500/30 animate-pulse' 
          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
      }`}
    >
      {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </button>
  );
};
export default VoiceInputButton;
