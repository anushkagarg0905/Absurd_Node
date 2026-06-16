'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type InvestigationStatus = 'Ready' | 'Analyzing' | 'Investigation Complete';

interface InvestigationContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  status: InvestigationStatus;
  setStatus: (status: InvestigationStatus) => void;
  selectedEntity: string | null;
  setSelectedEntity: (entity: string | null) => void;
  triggerSearch: (query: string) => void;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

export const InvestigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('OpenAI');
  const [status, setStatus] = useState<InvestigationStatus>('Investigation Complete');
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const router = useRouter();

  // Helper to run mock analysis sequence
  const triggerSearch = (query: string) => {
    if (!query.trim()) return;
    setSearchQuery(query);
    setStatus('Analyzing');
    
    // Simulate a brief analysis delay to wow the user with a scanning effect
    const timer = setTimeout(() => {
      setStatus('Investigation Complete');
    }, 1800);
    
    return () => clearTimeout(timer);
  };

  return (
    <InvestigationContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        status,
        setStatus,
        selectedEntity,
        setSelectedEntity,
        triggerSearch,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (context === undefined) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
};
