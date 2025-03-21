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
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});