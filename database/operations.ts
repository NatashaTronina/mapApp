import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';
import { Marker, MarkerImage } from "../types";


// Добавление маркера
export const addMarker = async (
  db: SQLite.SQLiteDatabase,
  latitude: number,
  longitude: number,
  title?: string,
  description?: string
): Promise<string> => {

  const id = uuidv4();
  console.log("Добавление маркера... ", { id, latitude, longitude, title, description });

  try {
    await db.runAsync(
      `INSERT INTO markers (id, latitude, longitude, title, description) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, latitude, longitude, title || '', description || '']
    );

    console.log("Маркер добавлен успешно:", id);
    return id;

  } catch (error) {
    console.error("Не удалось добавить маркер:", error);
    throw error;
  }
};


// Удаление маркера вместе с фотографиями
export const deleteMarker = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<void> => {

  console.log("Удаление маркера:", id);

  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM marker_images WHERE marker_id = ?`, [id]);

      await db.runAsync(`DELETE FROM markers WHERE id = ?`, [id]);
    });

    console.log("Маркер и привязанные изображения удалены!");

  } catch (error) {
    console.error("Ошибка при удалении маркера:", error);
    throw error;
  }
};

// Получение всех маркеров
export const getMarkers = async (
  db: SQLite.SQLiteDatabase
): Promise<Marker[]> => {

  console.log("Получение всех маркеров...");

  try {
    const rows = await db.getAllAsync<Marker>(
      `SELECT id, latitude, longitude, title, description, created_at 
       FROM markers ORDER BY created_at DESC`
    );

    console.log(`Маркеры загружены: ${rows.length} шт.`);
    return rows;

  } catch (error) {
    console.error("Не удалось п олучить маркре:", error);
    throw error;
  }
};


// Обновление маркера
export const updateMarker = async (
  db: SQLite.SQLiteDatabase,
  id: string,
  title?: string,
  description?: string
) => {

  console.log("Обновление маркера... ", { id, title, description });

  try {
    await db.runAsync(
      `UPDATE markers SET title = ?, description = ? WHERE id = ?`,
      [title || '', description || '', id]
    );

    console.log("Маркер обновлён:", id);

  } catch (error) {
    console.error("Не удалось обновить маркер:", error);
    throw error;
  }
};

// Добавление изображения
export const addImage = async (
  db: SQLite.SQLiteDatabase,
  markerId: string,
  uri: string
): Promise<string> => {

  const id = uuidv4();
  console.log("Добавление изображения... ", { id, markerId, uri });

  try {
    await db.runAsync(
      `INSERT INTO marker_images (id, marker_id, uri) VALUES (?, ?, ?)`,
      [id, markerId, uri]
    );

    console.log("Изображение добавлено:", id);
    return id;

  } catch (error) {
    console.error("Не удалось добавить изображение:", error);
    throw error;
  }
};



// Удаление изображения
export const deleteImage = async (
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<void> => {

  console.log("Удаляем изображение... ", id);

  try {
    await db.runAsync(
      `DELETE FROM marker_images WHERE id = ?`,
      [id]
    );

    console.log("Изображение удалено:", id);

  } catch (error) {
    console.error("Не удалось удалить изображение:", error);
    throw error;
  }
};



// Получение всех изображений конкретного маркера
export const getMarkerImages = async (
  db: SQLite.SQLiteDatabase,
  markerId: string
): Promise<MarkerImage[]> => {

  console.log("Получаем изображений для маркера:", markerId);

  try {
    const rows = await db.getAllAsync<MarkerImage>(
      `SELECT id, marker_id, uri, created_at 
       FROM marker_images 
       WHERE marker_id = ? 
       ORDER BY created_at DESC`,
      [markerId]
    );

    console.log(`Изображений загружено: ${rows.length}`);
    return rows;

  } catch (error) {
    console.error("Не удалось получить изображение:", error);
    throw error;
  }
};
