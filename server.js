require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')
const rateLimit = require('express-rate-limit')

// Импорт маршрутов
const authRoutes = require('./routes/auth')
const employeeRoutes = require('./routes/employees')
const employeesPublicRoutes = require('./routes/employeesPublic')
const criterionRoutes = require('./routes/criteria')
const evaluationRoutes = require('./routes/evaluations')
const reportRoutes = require('./routes/reports')
const publicRoutes = require('./routes/public')
const categoryRoutes = require('./routes/categories')

// Импорт подключения к БД
const { sequelize } = require('./models')

// ==================== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====================
const app = express()
const PORT = process.env.PORT || 3000

// ==================== RATE LIMITING (после app!) ====================
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 минут
	max: 100, // максимум 100 запросов
	message: { error: 'Слишком много запросов, попробуйте позже' },
})

app.use('/api/', limiter)

// ==================== MIDDLEWARE ====================
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Раздача статических файлов
app.use(express.static(path.join(__dirname, '../client')))

// ==================== МАРШРУТЫ API ====================
app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/employees-public', employeesPublicRoutes)
app.use('/api/criteria', criterionRoutes)
app.use('/api/evaluations', evaluationRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/categories', categoryRoutes)

// ==================== КОРНЕВОЙ МАРШРУТ ====================
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'))
})

// ==================== ЗАПУСК СЕРВЕРА ====================
sequelize
	.sync({ force: false })
	.then(() => {
		app.listen(PORT, () => {
			console.log(`✅ Сервер запущен на порту ${PORT}`)
			console.log(`📁 База данных: SQLite (database.sqlite)`)
			console.log(`🌐 Доступ по адресу: http://localhost:${PORT}`)
		})
	})
	.catch(err => {
		console.error('❌ Ошибка подключения к базе данных:', err)
		process.exit(1)
	})

// Обработка незавершённых обещаний
process.on('unhandledRejection', err => {
	console.error('Unhandled Rejection:', err)
	process.exit(1)
})
