const express = require('express')
const router = express.Router()
const { Employee } = require('../models')
const { verifyToken } = require('../middleware/auth')

// Все авторизованные пользователи могут получить базовый список сотрудников
router.use(verifyToken)

// Получить базовый список сотрудников (id, fullName, position)
router.get('/basic', async (req, res) => {
	try {
		const employees = await Employee.findAll({
			attributes: ['id', 'fullName', 'position', 'department'],
		})
		res.json(employees)
	} catch (error) {
		console.error('Ошибка получения списка сотрудников:', error)
		res.status(500).json({ error: error.message })
	}
})

module.exports = router
