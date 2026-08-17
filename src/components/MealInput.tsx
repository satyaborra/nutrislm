import React, { useState, useRef } from 'react';
import { Send, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';

interface MealInputProps {
  onSubmit: (text: string) => Promise<unknown>;
  loading: boolean;
  language?: string;
}

const MealInput: React.FC<MealInputProps> = ({ onSubmit, loading, language = 'English' }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    await onSubmit(text);
    setText('');
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate transcription
      setText("Breakfast: 2 eggs and a glass of milk (Transcribed)");
      inputRef.current?.focus();
    } else {
      setIsRecording(true);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <div className={`relative flex items-center shadow-sm rounded-2xl overflow-hidden bg-white border transition-all ${isRecording ? 'border-red-400 ring-2 ring-red-50' : 'border-emerald-100 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50'}`}>
        <div className={`pl-4 ${isRecording ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
          <Sparkles className="h-5 w-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={isRecording ? "Listening..." : text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`e.g., "Breakfast: 2 eggs and a glass of milk" (${language})`}
          className="w-full py-4 px-4 text-gray-700 focus:outline-none bg-transparent"
          disabled={loading || isRecording}
        />
        <button
          type="button"
          onClick={toggleRecording}
          className={`p-3 mr-1 rounded-xl transition-colors flex items-center justify-center ${isRecording ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          title="Voice Input"
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        <button
          type="submit"
          disabled={!text.trim() || loading || isRecording}
          className="mr-2 p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl transition-colors flex items-center justify-center"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 ml-1 flex items-center gap-1">
        Powered by AI. Enter your meal description naturally or use voice commands.
      </p>
    </form>
  );
};

export default MealInput;
