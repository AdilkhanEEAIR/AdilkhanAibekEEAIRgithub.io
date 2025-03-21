const db = require('../db'); 

// Регистрации пользователя
const registerUser = (username, email, password, callback) => {
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.run(query, [username, email, password], function(err) {
    callback(err, this.lastID); 
  });
};
// Поиск пользователя по email
const findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.get(query, [email], (err, row) => {
    callback(err, row); 
  });
};
module.exports = {
  registerUser,
  findUserByEmail
};