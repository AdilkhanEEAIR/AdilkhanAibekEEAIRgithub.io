const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Создание таблиц
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY, user_id INTEGER, token TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, user_id INTEGER, session_token TEXT)');
});
module.exports = db;