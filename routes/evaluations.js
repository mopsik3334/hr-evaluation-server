const express = require('express')
const router = express.Router()
const { Evaluation, Employee, Criterion, Category } = require('../models')
const { verifyToken } = require('../middleware/auth')
const checkRole = require('../middleware/checkRole')

router.use(verifyToken)
router.use(checkRole('HR', 'admin'))

// Получить все оценки (для отчётов)
router.get('/', async (req, res) => {
	try {
		const evaluations = await Evaluation.findAll({
			include: [
				{
					model: Employee,
					as: 'employee', // ← ДОБАВИТЬ!
					attributes: ['id', 'fullName', 'position', 'department'],
				},
				{
					model: Criterion,
					as: 'criterion', // ← ДОБАВИТЬ!
					attributes: ['id', 'name', 'categoryId'],
					include: [
						{
							model: Category,
							as: 'category', // ← ДОБАВИТЬ!
						},
					],
				},
			],
		})
		res.json(evaluations)
	} catch (error) {
		console.error('Ошибка получения всех оценок:', error)
		res.status(500).json({ error: error.message })
	}
})

// Получить оценки конкретного сотрудника
router.get('/employee/:employeeId', async (req, res) => {
	try {
		const { employeeId } = req.params
		const evaluations = await Evaluation.findAll({
			where: { employeeId: parseInt(employeeId) },
			include: [
				{
					model: Criterion,
					as: 'criterion', // ← ДОБАВИТЬ!
					attributes: ['id', 'name', 'categoryId'],
					include: [
						{
							model: Category,
							as: 'category', // ← ДОБАВИТЬ!
						},
					],
				},
				{
					model: Employee,
					as: 'employee', // ← ДОБАВИТЬ!
					attributes: ['id', 'fullName', 'position'],
				},
			],
		})
		res.json(evaluations)
	} catch (error) {
		console.error('Ошибка получения оценок сотрудника:', error)
		res.status(500).json({ error: error.message })
	}
})

// Создать оценку
router.post('/', async (req, res) => {
	try {
		const { employeeId, criterionId, score } = req.body

		if (!employeeId || !criterionId || !score) {
			return res.status(400).json({ error: 'Все поля обязательны' })
		}

		if (score < 1 || score > 5) {
			return res.status(400).json({ error: 'Балл должен быть от 1 до 5' })
		}

		// Проверяем, существует ли уже оценка для этого сотрудника и критерия
		const existing = await Evaluation.findOne({
			where: { employeeId, criterionId },
		})

		if (existing) {
			return res.status(409).json({ error: 'Оценка уже существует' })
		}

		const evaluation = await Evaluation.create({
			employeeId,
			criterionId,
			score,
			evaluatedBy: req.user.id,
		})

		res.status(201).json(evaluation)
	} catch (error) {
		console.error('Ошибка создания оценки:', error)
		res.status(500).json({ error: error.message })
	}
})

// Обновить оценку
router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const { score } = req.body

		if (!score || score < 1 || score > 5) {
			return res.status(400).json({ error: 'Балл должен быть от 1 до 5' })
		}

		const evaluation = await Evaluation.findByPk(id)
		if (!evaluation) {
			return res.status(404).json({ error: 'Оценка не найдена' })
		}

		await evaluation.update({ score })

		// Возвращаем обновлённую оценку с связанными данными
		const updated = await Evaluation.findByPk(id, {
			include: [
				{
					model: Criterion,
					as: 'criterion', // ← ДОБАВИТЬ!
					attributes: ['id', 'name', 'categoryId'],
					include: [{ model: Category, as: 'category' }],
				},
			],
		})

		res.json(updated)
	} catch (error) {
		console.error('Ошибка обновления оценки:', error)
		res.status(500).json({ error: error.message })
	}
})

// Удалить оценку
router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params
		const evaluation = await Evaluation.findByPk(id)

		if (!evaluation) {
			return res.status(404).json({ error: 'Оценка не найдена' })
		}

		await evaluation.destroy()
		res.status(204).send()
	} catch (error) {
		console.error('Ошибка удаления оценки:', error)
		res.status(500).json({ error: error.message })
	}
})

module.exports = router
