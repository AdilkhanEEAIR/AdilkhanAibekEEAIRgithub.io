const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const app = express();
// Миддлвары
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
// Маршруты
app.use('/', userRoutes);
// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err.message || err);
  // Убедимся, что res существует и у него есть метод status()
  if (res && res.status) {
    // Поставим конкретные коды ошибок, если они есть
    if (err.status === 400) {
      return res.status(400).send(err.message || 'Неверные данные');
    }
    if (err.status === 401) {
      return res.status(401).send(err.message || 'Не авторизован');
    }
    // Для всех остальных ошибок — 500
    return res.status(500).send(err.message || 'Что-то пошло не так!');
  }
  // Если res не существует, передаем ошибку дальше
  next(err);
});
// Указание порта
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
// Обработка ошибок на уровне сервера (если ошибки происходят в процессе работы сервера)
server.on('error', (err) => {
  console.error('Ошибка на сервере:', err);
});