const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
// Создание таблиц
db.serialize(() => {
  // Таблица пользователей
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)');
  // Таблица сессий
  db.run('CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, user_id INTEGER, session_token TEXT, expires_at TEXT)');
  // Таблица куки
  db.run('CREATE TABLE IF NOT EXISTS cookies (id INTEGER PRIMARY KEY, user_id INTEGER, cookie_value TEXT, expires_at TEXT)');
  // Таблица туров
  db.run('CREATE TABLE IF NOT EXISTS trips (id INTEGER PRIMARY KEY, destination TEXT, description TEXT, start_date TEXT, end_date TEXT)');
});
console.log('Таблица trips была успешно создана или уже существует.');
module.exports = db;