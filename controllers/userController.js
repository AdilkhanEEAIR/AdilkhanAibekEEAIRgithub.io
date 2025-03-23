const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const fs = require('fs').promises;
const db = require('../db'); // подключаем базу данных

const JWT_SECRET = 'your_secret_key';

// Схема для валидации данных пользователя
const schema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

// Регистрация пользователя
const registerUser = async (req, res, next) => {
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

    // Сохранение нового пользователя
    const userId = await userModel.registerUser(username, email, password);
    console.log(`Пользователь успешно зарегистрирован, ID: ${userId}`);

    // Генерация токена сессии
    const sessionToken = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Сгенерирован токен сессии:', sessionToken);

    // Устанавливаем cookie
    res.cookie('session_token', sessionToken, {
      httpOnly: true,  // Cookie будет доступно только через HTTP
      maxAge: 3600000, // Время жизни cookie — 1 час
    });

    // Запись данных в файл
    const data = `Username: ${username}, Email: ${email}, Password: ${password}, Session Token: ${sessionToken}\n`;
    await fs.appendFile('registrations.txt', data);
    console.log('Данные успешно сохранены в файл!');

    // Отправка успешного ответа
    res.status(200).send('Данные успешно сохранены в файл и регистрация успешна!');
  } catch (err) {
    console.log('Ошибка при выполнении операции:', err);
    next(err);
  }
};

// Схема для валидации данных тура
const tripSchema = Joi.object({
  destination: Joi.string().required(),
  description: Joi.string().required(),
  start_date: Joi.string().required(),
  end_date: Joi.string().required(),
});

// Создание тура
const createTrip = async (req, res, next) => {
  const { destination, description, start_date, end_date } = req.body;

  // Валидация данных тура
  const { error } = tripSchema.validate({ destination, description, start_date, end_date });
  if (error) {
    return res.status(400).send('Ошибка валидации данных тура: ' + error.details[0].message);
  }

  const query = 'INSERT INTO trips (destination, description, start_date, end_date) VALUES (?, ?, ?, ?)';
  db.run(query, [destination, description, start_date, end_date], function (err) {
    if (err) {
      return next(err);
    }
    res.status(201).send('Тур успешно создан');
  });
};

// Получение всех туров
const getAllTrips = (req, res, next) => {
  const query = 'SELECT * FROM trips';
  db.all(query, [], (err, rows) => {
    if (err) {
      return next(err);
    }
    res.status(200).json(rows);
  });
};

// Регистрация поездки пользователя
const addUserTrip = async (req, res, next) => {
  const { trip_id } = req.body;
  const user_id = req.userId; // ID пользователя, получаем из токена сессии

  // Проверка, существует ли тур
  const query = 'SELECT * FROM trips WHERE id = ?';
  db.get(query, [trip_id], (err, row) => {
    if (err || !row) {
      return res.status(400).send('Тур не найден');
    }

    const created_at = new Date().toISOString();
    const insertQuery = 'INSERT INTO user_trips (user_id, trip_id, created_at) VALUES (?, ?, ?)';
    db.run(insertQuery, [user_id, trip_id, created_at], function (err) {
      if (err) {
        return next(err);
      }
      res.status(201).send('Поездка успешно зарегистрирована');
    });
  });
};

// Миддлвар для проверки авторизации
const checkAuthMiddleware = (req, res, next) => {
  const { session_token } = req.cookies;

  if (!session_token) {
    return res.status(401).send('Не авторизован');
  }

  // Проверка сессии
  jwt.verify(session_token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Неверная сессия');
    }
    req.userId = decoded.userId; // Получаем userId из токена
    next();
  });
};

// Экспортируем все функции
module.exports = {
  registerUser,
  createTrip,
  getAllTrips,
  addUserTrip,
  checkAuthMiddleware,  // Экспортируем миддлвар для авторизации
};