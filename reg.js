const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const app = express();
// Миддлвары для обработки данных
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // cookie-parser
// Маршруты для пользователя
app.use('/', userRoutes);
// Глобальный обработчик ошибок
app.use((err, req, res) => {
  console.error('Ошибка:', err.message || err);
  // Проверка на тип ошибки
  if (err.status === 400) {
    return res.status(400).send(err.message || 'Неверные данные');
  }
  
  if (err.status === 401) {
    return res.status(401).send(err.message || 'Не авторизован');
  }
  // Для остальных ошибок — ошибка 500 (внутренние ошибки сервера)
  res.status(500).send(err.message || 'Что-то пошло не так!');
});
// Указание порта
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});