const bcrypt = require('bcryptjs') // Библиотека для хеширования паролей
const jwt = require('jsonwebtoken') // Библиотека для работы с JWT-токенами

// ХЕШИРОВАНИЕ ПАРОЛЯ 
// Преобразует обычный пароль в хеш (необратимое шифрование)
async function hashPassword(password) {
	// 10 раундов хеширования — баланс между безопасностью и скоростью
	return await bcrypt.hash(password, 10)
}

// ПРОВЕРКА ПАРОЛЯ 
// Сравнивает введённый пароль с хешем из базы данных
async function verifyPassword(password, hash) {
	return await bcrypt.compare(password, hash)
}

// ГЕНЕРАЦИЯ JWT-ТОКЕНА 
// Создаёт токен для аутентификации пользователя
function generateToken(user) {
	return jwt.sign(
		{
			id: user.id, // ID пользователя в токене
			username: user.username,
			role: user.role, // Роль для проверки прав доступа
		},
		process.env.JWT_SECRET || 'default_secret', // Секретный ключ из .env
		{ expiresIn: '24h' }, // Токен действителен 24 часа
	)
}

// ПРОВЕРКА JWT-ТОКЕНА (Middleware) 
// Промежуточная функция для защиты маршрутов
function verifyToken(req, res, next) {
	// Получаем токен из заголовка Authorization: "Bearer <token>"
	const authHeader = req.headers.authorization

	if (!authHeader) {
		return res.status(401).json({ error: 'Токен не предоставлен' })
	}

	// Извлекаем токен (второе слово после "Bearer")
	const token = authHeader.split(' ')[1]

	if (!token) {
		return res.status(401).json({ error: 'Неверный формат токена' })
	}

	try {
		// Проверяем и декодируем токен
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || 'default_secret',
		)
		req.user = decoded // Добавляем данные пользователя в запрос
		next() // Передаём управление следующему middleware
	} catch (err) {
		return res.status(403).json({ error: 'Неверный или истёкший токен' })
	}
}

// ПРОВЕРКА РОЛИ (Middleware) 
// Ограничивает доступ только для определённых ролей
function checkRole(requiredRole) {
	return (req, res, next) => {
		if (req.user.role !== requiredRole) {
			return res.status(403).json({ error: 'Недостаточно прав доступа' })
		}
		next()
	}
}

// Экспорт всех функций для использования в контроллерах и маршрутах
module.exports = {
	hashPassword,
	verifyPassword,
	generateToken,
	verifyToken,
	checkRole,
}
