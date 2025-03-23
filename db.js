const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); 
db.serialize(() => {
  // Создание таблицы для пользователей
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)');
  // Создание таблицы для сессий с колонкой expires_at
  db.run('CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, user_id INTEGER, session_token TEXT, expires_at TEXT)');
  // Создание таблицы для cookies
  db.run('CREATE TABLE IF NOT EXISTS cookies (id INTEGER PRIMARY KEY, user_id INTEGER, cookie_value TEXT, expires_at TEXT)');
});
module.exports = db;