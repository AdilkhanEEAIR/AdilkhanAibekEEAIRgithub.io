const Joi = require('joi');
const fs = require('fs'); 
const userModel = require('../models/userModel'); 

// Схема для валидации данных
const schema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required() 
});
exports.registerUser = (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  // Валидация данных
  const { error } = schema.validate({ username, email, password, confirmPassword });
  if (error) {
    console.log('Ошибка валидации:', error.details[0].message); 
    return res.status(400).send('Ошибка валидации: ' + error.details[0].message); 
  }

  console.log('Полученные данные для регистрации:');
  console.log('Имя пользователя:', username);
  console.log('Email:', email);
  console.log('Пароль:', password);
  console.log('Подтверждение пароля:', confirmPassword);

  // Проверка, существует ли пользователь
  userModel.findUserByEmail(email, (err, user) => {
    if (err) {
      console.log('Ошибка при поиске пользователя:', err); 
      return res.status(500).send('Ошибка при поиске пользователя'); 
    }
    if (user) {
      console.log('Пользователь с таким email уже существует'); 
      return res.status(400).send('Пользователь с таким email уже существует'); 
    }
    // Сохранение нового пользователя
    userModel.registerUser(username, email, password, (err, userId) => {
      if (err) {
        console.log('Ошибка при сохранении пользователя:', err); 
        return res.status(500).send('Ошибка при сохранении пользователя'); 
      }

      console.log('Пользователь успешно зарегистрирован. ID:', userId);
      const data = `Username: ${username}, Email: ${email}, Password: ${password}, Confirm Password: ${confirmPassword}\n`;

      // В файл
      fs.appendFile('registrations.txt', data, (err) => {
        if (err) {
          console.log('Ошибка при записи в файл:', err); // Выводим ошибку записи в файл
          return res.status(500).send('Ошибка при сохранении данных в файл'); // Отправляем ошибку клиенту
        }
        console.log('Данные успешно сохранены в файл!');
        res.status(200).send('Данные успешно сохранены в файл и регистрация успешна!');
      });
    });
  });
};