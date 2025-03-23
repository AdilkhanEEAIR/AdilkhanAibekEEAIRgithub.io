const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');
// Миддлвар для проверки авторизации
const checkAuthMiddleware = (req, res, next) => {
  const { session_token } = req.cookies;
  if (!session_token) {
    return res.status(401).send('Не авторизован');
  }
  // Проверка сессии
  jwt.verify(session_token, 'your_secret_key', (err, decoded) => {
    if (err) {
      console.log('Ошибка при проверке токена:', err);
      return res.status(401).send('Неверная сессия');
    }
    req.userId = decoded.userId;
    next();
  });
};
// Защищённый маршрут
router.get('/protected', checkAuthMiddleware, (req, res) => {
  res.status(200).send('Это защищённый маршрут');
});
// Маршрут для регистрации
router.post('/register', userController.registerUser);
module.exports = router;


//Маршруты для туров
// Создание тура
router.post('/trips', checkAuthMiddleware, userController.createTrip);
// Получение всех туров
router.get('/trips', userController.getAllTrips);
// Добавление поездки пользователя
router.post('/user/trips', checkAuthMiddleware, userController.addUserTrip);
module.exports = router;