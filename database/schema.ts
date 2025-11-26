
export const initDatabase = async () => {
  try {
    const db = await openDatabase('markers.db');
    await db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS markers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );
      // ... создание других таблиц
    });
    return db;
  } catch (error) {
    console.error('Ошибка инициализации базы данных:', error);
    throw error;
  }
};