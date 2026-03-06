const express = require('express')
const router = express.Router()
const { Employee, Criterion, Category, Evaluation } = require('../models')
const { verifyToken } = require('../middleware/auth')

// Все маршруты требуют авторизации
router.use(verifyToken)

// Получить базовый список сотрудников (id, fullName, position, department)
router.get('/employees', async (req, res) => {
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

// Получить критерии с категориями
router.get('/criteria', async (req, res) => {
	try {
		const criteria = await Criterion.findAll({
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name'],
				},
			],
		})
		res.json(criteria)
	} catch (error) {
		console.error('Ошибка получения критериев:', error)
		res.status(500).json({ error: error.message })
	}
})

// Получить оценки конкретного сотрудника
router.get('/evaluations/:employeeId', async (req, res) => {
	try {
		const { employeeId } = req.params
		const evaluations = await Evaluation.findAll({
			where: { employeeId: parseInt(employeeId) },
			include: [
				{
					model: Criterion,
					as: 'criterion',
					attributes: ['id', 'name', 'categoryId'],
					include: [
						{
							model: Category,
							as: 'category',
							attributes: ['id', 'name'],
						},
					],
				},
			],
		})
		res.json(evaluations)
	} catch (error) {
		console.error('Ошибка получения оценок:', error)
		res.status(500).json({ error: error.message })
	}
})

module.exports = router
