import * as SQLite from 'expo-sqlite';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initDatabase } from '../database/schema';
import { Marker, MarkerImage } from '../types';

import {
  addImage as addImageOperation,
  addMarker as addMarkerOperation,
  deleteImage as deleteImageOperation,
  deleteMarker as deleteMarkerOperation,
  getMarkerImages as getMarkerImagesOperation,
  getMarkers as getMarkersOperation,
  updateMarker as updateMarkerOperation,
} from '../database/operations';

import { Text } from 'react-native';

interface DatabaseContextType {
  addMarker: (latitude: number, longitude: number, title?: string, description?: string) => Promise<string>;
  deleteMarker: (id: string) => Promise<void>;
  getMarkers: () => Promise<Marker[]>;
  updateMarker: (id: string, title?: string, description?: string) => Promise<void>;
  addImage: (markerId: string, uri: string) => Promise<string>;
  deleteImage: (id: string) => Promise<void>;
  getMarkerImages: (markerId: string) => Promise<MarkerImage[]>;
  isLoading: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Инициализация бд
  useEffect(() => {
    const initialize = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const addMarker = async (latitude: number, longitude: number, title?: string, description?: string) => {
  if (!db) {
    throw new Error('База данных не инициализирована');
  }
  return addMarkerOperation(db, latitude, longitude, title, description);
  };

  const deleteMarker = async (id: string) => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    return deleteMarkerOperation(db, id);
  };

  const getMarkers = async () => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    return getMarkersOperation(db);
  };

  const updateMarker = async (id: string, title?: string, description?: string) => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    return updateMarkerOperation(db, id, title, description);
  };

  const addImage = async (markerId: string, uri: string) => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    return addImageOperation(db, markerId, uri);
  };

  const deleteImage = async (id: string) => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    return deleteImageOperation(db, id);
  };

  const getMarkerImages = async (markerId: string) => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    return getMarkerImagesOperation(db, markerId);
  };

  const value = {
    addMarker, deleteMarker, getMarkers, updateMarker, addImage, deleteImage, getMarkerImages, isLoading, error
  };

  if (isLoading) {
    return <Text>Загрузка базы данных</Text>;
  }
  if (error) {
    return <Text>Ошибка базы данных: {error.message}</Text>;
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
