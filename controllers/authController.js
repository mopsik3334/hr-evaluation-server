const { User } = require('../models')
const {
	hashPassword,
	verifyPassword,
	generateToken,
} = require('../middleware/auth')

// РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ 
exports.register = async (req, res) => {
	try {
		const { username, password, role } = req.body

		// Проверка обязательных полей
		if (!username || !password) {
			return res.status(400).json({ error: 'Логин и пароль обязательны' })
		}

		// Проверка: не занят ли логин
		const existingUser = await User.findOne({ where: { username } })
		if (existingUser) {
			return res
				.status(409)
				.json({ error: 'Пользователь с таким логином уже существует' })
		}

		// Хешируем пароль перед сохранением
		const passwordHash = await hashPassword(password)

		// Создаём пользователя в базе
		const user = await User.create({
			username,
			passwordHash,
			role: role || 'HR',
		})

		// Возвращаем данные без пароля
		res.status(201).json({
			id: user.id,
			username: user.username,
			role: user.role,
		})
	} catch (error) {
		console.error('Ошибка регистрации:', error)
		res.status(500).json({ error: 'Ошибка сервера при регистрации' })
	}
}

// ВХОД В СИСТЕМУ 
exports.login = async (req, res) => {
	try {
		const { username, password } = req.body

		// Проверка обязательных полей
		if (!username || !password) {
			return res.status(400).json({ error: 'Логин и пароль обязательны' })
		}

		// Ищем пользователя по логину
		const user = await User.findOne({ where: { username } })
		if (!user) {
			return res.status(401).json({ error: 'Неверный логин или пароль' })
		}

		// Проверяем пароль
		const validPassword = await verifyPassword(password, user.passwordHash)
		if (!validPassword) {
			return res.status(401).json({ error: 'Неверный логин или пароль' })
		}

		// Генерируем JWT-токен
		const token = generateToken(user)

		// Возвращаем токен и данные пользователя
		res.json({
			token,
			user: {
				id: user.id,
				username: user.username,
				role: user.role,
			},
		})
	} catch (error) {
		console.error('Ошибка входа:', error)
		res.status(500).json({ error: 'Ошибка сервера при входе' })
	}
}

//  ПОЛУЧЕНИЕ ПРОФИЛЯ 
exports.getProfile = async (req, res) => {
	try {
		// req.user доступен благодаря middleware verifyToken
		const user = await User.findByPk(req.user.id, {
			attributes: ['id', 'username', 'role'], // Не возвращаем passwordHash
		})

		if (!user) {
			return res.status(404).json({ error: 'Пользователь не найден' })
		}

		res.json(user)
	} catch (error) {
		console.error('Ошибка получения профиля:', error)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
}
