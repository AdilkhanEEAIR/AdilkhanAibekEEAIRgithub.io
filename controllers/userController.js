const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const fs = require('fs').promises; 
const JWT_SECRET = 'your_secret_key'; 
// Схема для валидации данных
const schema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});
// Регистрация пользователя
exports.registerUser = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  // Валидация данных
  const { error } = schema.validate({ username, email, password, confirmPassword });
  if (error) {
    console.log('Ошибка валидации:', error.details[0].message);
    return res.status(400).send('Ошибка валидации: ' + error.details[0].message);
  }
  console.log(`Пользователь ${username}`);
  try {
    // Проверка на существование пользователя
    const user = await userModel.findUserByEmail(email);
    if (user) {
      console.log('Пользователь с таким email уже существует:', email);
      return res.status(400).send('Пользователь с таким email уже существует');
    }
    console.log(`email ${email}`);
    // Сохранение нового пользователя
    const userId = await userModel.registerUser(username, email, password);
    console.log(`Пользователь успешно зарегистрирован, ID: ${userId}`);
    // Генерация токена сессии
    const sessionToken = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Сгенерирован токен сессии:', sessionToken);
    // Запись данных в файл
    const data = `Username: ${username}, Email: ${email}, Password: ${password}, Confirm Password: ${confirmPassword}, Session Token: ${sessionToken}\n`;
    await fs.appendFile('registrations.txt', data);
    console.log('Данные успешно сохранены в файл!');
    // Отправка успешного ответа
    res.status(200).send('Данные успешно сохранены в файл и регистрация успешна!');
  } catch (err) {
    console.log('Ошибка при выполнении операции:', err);
    // Передаем ошибку в глобальный обработчик ошибок
    next(err);
  }
};