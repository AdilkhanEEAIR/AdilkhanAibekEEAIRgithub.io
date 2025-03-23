const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
// Создание таблиц


//3 таблицы users, sessions ans cookies
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, user_id INTEGER, session_token TEXT, expires_at TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS cookies (id INTEGER PRIMARY KEY, user_id INTEGER, cookie_value TEXT, expires_at TEXT)');
});
module.exports = db;