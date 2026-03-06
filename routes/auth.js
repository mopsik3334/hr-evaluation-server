const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')

// POST /api/auth/register — Регистрация нового пользователя
router.post('/register', authController.register)

// POST /api/auth/login — Вход в систему
router.post('/login', authController.login)

// GET /api/auth/profile — Получение профиля (требует токен)
router.get('/profile', verifyToken, authController.getProfile)

module.exports = router
