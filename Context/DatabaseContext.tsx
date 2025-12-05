import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { Marker, MarkerImage } from '../types';
import { initDatabase } from '../database/schema';
import {
  addMarker as addMarkerOperation,
  deleteMarker as deleteMarkerOperation,
  getMarkers as getMarkersOperation,
  updateMarker as updateMarkerOperation,
  addImage as addImageOperation,
  deleteImage as deleteImageOperation,
  getMarkerImages as getMarkerImagesOperation,
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

  const addMarker = async (latitude: number, longitude: number, title?: string, description?: string): Promise<string> => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    try {
      const id = await addMarkerOperation(db, latitude, longitude, title, description);
      return id;
    } catch (err) {
      console.error('Error in addMarker:', err); 
      throw err;  
    }
  };

  const deleteMarker = async (id: string): Promise<void> => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    await deleteMarkerOperation(db, id);
    console.log('Маркер удален из базы:', id);
  };

  const getMarkers = async (): Promise<Marker[]> => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    };
    const markers = await getMarkersOperation(db);
    console.log('Маркеры загружены из базы:', markers.length);
    return markers;
  };

  const updateMarker = async (id: string, title?: string, description?: string): Promise<void> => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    await updateMarkerOperation(db, id, title, description);
    console.log('Маркер обновлен в базе:', id);
  };

  const addImage = async (markerId: string, uri: string): Promise<string> => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    const id = await addImageOperation(db, markerId, uri);
    console.log('Изображение добавлено в базу:', id);
    return id;
  };

  const deleteImage = async (id: string): Promise<void> => {
    if (!db) { 
      throw new Error('База данных не инициализирована');
    }
    await deleteImageOperation(db, id);
  };

  const getMarkerImages = async (markerId: string): Promise<MarkerImage[]> => {
    if (!db) {
      throw new Error('База данных не инициализирована');
    }
    const images: MarkerImage[] = await getMarkerImagesOperation(db, markerId);
    return images;
  };

  const value: DatabaseContextType = { addMarker, deleteMarker, getMarkers, updateMarker, addImage, deleteImage, getMarkerImages, isLoading, error };

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
