const express = require('express');
const { register, login } = require('../controllers/user.controller');
const validate = require('../middlewares/validation.middleware');
const { userSchema } = require('../utils/joiSchemas');

const router = express.Router();

router.post('/register', validate(userSchema), register);
router.post('/login', login);

module.exports = router;