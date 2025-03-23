const db = require('../db');
// Регистрация пользователя
const registerUser = (username, email, password, callback) => {
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.run(query, [username, email, password], function(err) {
    if (err) {
      console.error('Ошибка при регистрации пользователя:', err);
    }
    callback(err, this.lastID); 
  });
};
// Поиск пользователя по email
const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.get(query, [email], (err, row) => {
    if (err) {
      console.error('Ошибка при поиске пользователя:', err);
    }
    callback(err, row);
  });
};
// Создание сессии
const createSession = (userId, sessionToken, expiresAt, callback) => {
  const query = 'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)';
  db.run(query, [userId, sessionToken, expiresAt], function(err) {
    if (err) {
      console.error('Ошибка при создании сессии:', err);
    }
    callback(err, this.lastID); 
  });
};
module.exports = {
  registerUser,
  findUserByEmail,
  createSession
};