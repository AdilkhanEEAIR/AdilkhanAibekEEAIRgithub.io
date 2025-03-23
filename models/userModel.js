const db = require('../db');
// Регистрация пользователя
const registerUser = (username, email, password) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.run(query, [username, email, password], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID); 
      }
    });
  });
};
// Поиск пользователя по email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, row) => {
      if (err) {
        reject(err); // Отклоняем промис с ошибкой
      } else {
        resolve(row); // Разрешаем промис с данными пользователя
      }
    });
  });
};
module.exports = {
  registerUser,
  findUserByEmail,
};