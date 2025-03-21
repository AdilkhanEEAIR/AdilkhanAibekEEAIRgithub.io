const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

// Middleware для обработки данных формы
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Обработка POST-запроса на /register
app.post('/register', (req, res) => {
  console.log('Полученные данные:', req.body);
  const { username, email, password, confirmPassword } = req.body;
  // Проверка
  if (!username || !email || !password || !confirmPassword) {
    console.log('Ошибка: Не все поля заполнены');
    return res.status(400).send('Все поля обязательны для заполнения!');
  }
  if (password !== confirmPassword) {
    return res.status(400).send('Пароли не совпадают!');
  }

  // Выходит в файл
  const data = `Username: ${username}, Email: ${email}, Password: ${password}, Confirm Password: ${confirmPassword}\n`;

  // Сохранение данных в файл
  fs.appendFile('registrations.txt', data, (err) => {
    if (err) {
      console.error('Ошибка при записи в файл:', err);
      return res.status(500).send('Ошибка при сохранении данных');
    }
    res.status(200).send('Данные успешно сохранены!');
  });
});
// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});