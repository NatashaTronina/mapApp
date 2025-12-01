import 'react-native-get-random-values';  
import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { Marker, MarkerImage } from "../types";


export const addMarker = async (
  db: SQLite.SQLiteDatabase,
  latitude: number,
  longitude: number,
  title?: string,
  description?: string
): Promise<string> => {
  const id = uuidv4();
  await db.runAsync(
    'INSERT INTO markers (id, latitude, longitude, title, description) VALUES (?, ?, ?, ?, ?)',
    [id, latitude, longitude, title || '', description || '']
  );
  return id;
};

export const deleteMarker = async (db: SQLite.SQLiteDatabase, id: string): Promise<void> => {
  await db.runAsync('DELETE FROM markers WHERE id = ?', [id]);
};

export const getMarkers = async (db: SQLite.SQLiteDatabase): Promise<Marker[]> => {
  return await db.getAllAsync<Marker>('SELECT id, latitude, longitude, title, description, created_at FROM markers ORDER BY created_at DESC');
};

export const updateMarker = async (
  db: SQLite.SQLiteDatabase,
  id: string,
  title?: string,
  description?: string
): Promise<void> => {
  await db.runAsync(
    'UPDATE markers SET title = ?, description = ? WHERE id = ?',
    [title || '', description || '', id]
  );
};

export const addImage = async (db: SQLite.SQLiteDatabase, markerId: string, uri: string): Promise<string> => {
  const id = uuidv4();
  await db.runAsync(
    'INSERT INTO marker_images (id, marker_id, uri) VALUES (?, ?, ?)',
    [id, markerId, uri]
  );
  return id;
};

export const deleteImage = async (db: SQLite.SQLiteDatabase, id: string): Promise<void> => {
  await db.runAsync('DELETE FROM marker_images WHERE id = ?', [id]);
};

export const getMarkerImages = async (db: SQLite.SQLiteDatabase, markerId: string): Promise<MarkerImage[]> => {
  return await db.getAllAsync<MarkerImage>(
    'SELECT id, marker_id, uri, created_at FROM marker_images WHERE marker_id = ? ORDER BY created_at DESC',
    [markerId]
  );
};