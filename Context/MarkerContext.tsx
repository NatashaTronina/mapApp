import React, { createContext, useContext, useState } from 'react';
import { MarkersData } from '../types';

const MarkersContext = createContext<{
  markers: MarkersData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkersData[]>>;
} | undefined>(undefined);

export const MarkersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [markers, setMarkers] = useState<MarkersData[]>([]);

  return (
    <MarkersContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MarkersContext.Provider>
  );
};

export const useMarkers = () => {
  const context = useContext(MarkersContext);
  if (!context) {
    throw new Error('useMarkers необходимо использовать внутри MarkersProvider');
  }
  return context;
};