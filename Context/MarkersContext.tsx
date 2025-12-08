import React, { createContext, useContext, useState, useCallback } from 'react';
import { MarkersData } from '../types';

interface MarkersContextType {
  markers: MarkersData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkersData[]>>;
  addMarkerToState: (marker: MarkersData) => void;
  updateMarkerInState: (id: string, title: string, description: string) => void;
  deleteMarkerFromState: (id: string) => void;
}

const MarkersContext = createContext<MarkersContextType | undefined>(undefined);

export const MarkersProvider = ({ children }: { children: React.ReactNode }) => {
  const [markers, setMarkers] = useState<MarkersData[]>([]);

  const addMarkerToState = useCallback((marker: MarkersData) => {
    setMarkers((prev) => [...prev, marker]);
  }, []);

  const updateMarkerInState = useCallback((id: string, title: string, description: string) => {
    setMarkers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, title, description } : m
      )
    );
  }, []);

  const deleteMarkerFromState = useCallback((id: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <MarkersContext.Provider
      value={{
        markers,
        setMarkers,
        addMarkerToState,
        updateMarkerInState,
        deleteMarkerFromState,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};

export const useMarkersContext = () => {
  const ctx = useContext(MarkersContext);
  if (!ctx) throw new Error('useMarkersContext must be used inside MarkersProvider');
  return ctx;
};
