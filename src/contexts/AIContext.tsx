import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { isAnyLocalModelInstalled } from '../utils/modelConfig';

export type ProcessingMode = 'auto' | 'online' | 'offline';
export type AICapabilityState = 'ONLINE_READY' | 'OFFLINE_READY' | 'OFFLINE_MODEL_MISSING' | 'OFFLINE_MODEL_LOADING' | 'OFFLINE_UNAVAILABLE';

interface AIContextType {
  processingMode: ProcessingMode;
  setProcessingMode: (mode: ProcessingMode) => void;
  capabilityState: AICapabilityState;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [processingMode, setProcessingModeState] = useState<ProcessingMode>(() => {
    const saved = localStorage.getItem('ai_processing_mode');
    return (saved as ProcessingMode) || 'auto';
  });

  const [capabilityState, setCapabilityState] = useState<AICapabilityState>('ONLINE_READY');

  const setProcessingMode = (mode: ProcessingMode) => {
    setProcessingModeState(mode);
    localStorage.setItem('ai_processing_mode', mode);
  };

  useEffect(() => {
    // Evaluate capability state based on mode and local model availability
    const hasLocalModels = isAnyLocalModelInstalled();
    
    if (processingMode === 'online') {
      setCapabilityState('ONLINE_READY');
    } else if (processingMode === 'offline') {
      if (hasLocalModels) {
        setCapabilityState('OFFLINE_READY');
      } else {
        setCapabilityState('OFFLINE_MODEL_MISSING');
      }
    } else {
      // auto mode
      if (hasLocalModels) {
        setCapabilityState('OFFLINE_READY'); // Prefer offline in auto if possible
      } else {
        setCapabilityState('ONLINE_READY');
      }
    }
  }, [processingMode]);

  return (
    <AIContext.Provider value={{ processingMode, setProcessingMode, capabilityState }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
