import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAI } from '../contexts/AIContext';

const ImageUpload: React.FC<{ onImageSelect: (file: File) => void }> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { capabilityState } = useAI();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div 
        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-emerald-400 transition-colors bg-white group"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
        <div className="flex gap-4 mb-2">
          <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-600 text-gray-500 transition-colors">
            <Camera className="h-6 w-6" />
          </div>
          <div className="p-2.5 bg-gray-100 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-600 text-gray-500 transition-colors">
            <ImageIcon className="h-6 w-6" />
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-600 group-hover:text-emerald-600">Tap to Snap or Upload Food</p>
      </div>

      {capabilityState === 'OFFLINE_READY' && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium border border-emerald-100 dark:border-emerald-800/30">
          <Lock className="w-4 h-4 shrink-0" /> 
          Privacy Protected: Food images processed locally (No upload required).
        </div>
      )}
      {capabilityState === 'OFFLINE_MODEL_MISSING' && (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium border border-amber-100 dark:border-amber-800/30">
          <AlertTriangle className="w-4 h-4 shrink-0" /> 
          <div>
            <span className="font-bold">Offline AI — Preview:</span> Local AI Runtime Not Installed. Switch to Online Mode.
          </div>
        </div>
      )}
      {capabilityState === 'ONLINE_READY' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-medium border border-blue-100 dark:border-blue-800/30">
          <ShieldCheck className="w-4 h-4 shrink-0" /> 
          Online Mode Active: Fast cloud-based VLM processing.
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
