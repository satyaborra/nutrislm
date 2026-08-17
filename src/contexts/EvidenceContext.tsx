import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EvidenceItem {
  id: string;
  source: string;
  document: string;
  content: string;
  relevanceScore: number;
  evidenceType: string;
}

export interface RAGResult {
  answer: string;
  grounded: boolean;
  retrievalStatus: string;
  evidence: EvidenceItem[];
  model: string;
}

interface EvidenceContextType {
  latestEvidence: EvidenceItem[];
  addEvidence: (items: EvidenceItem[]) => void;
}

const EvidenceContext = createContext<EvidenceContextType | undefined>(undefined);

export const EvidenceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [latestEvidence, setLatestEvidence] = useState<EvidenceItem[]>([]);

  const addEvidence = (items: EvidenceItem[]) => {
    setLatestEvidence(items);
  };

  return (
    <EvidenceContext.Provider value={{ latestEvidence, addEvidence }}>
      {children}
    </EvidenceContext.Provider>
  );
};

export const useEvidence = () => {
  const context = useContext(EvidenceContext);
  if (!context) {
    throw new Error('useEvidence must be used within an EvidenceProvider');
  }
  return context;
};
