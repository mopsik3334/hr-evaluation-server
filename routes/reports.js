const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
// Без checkRole - доступно всем авторизованным

router.use(verifyToken)

// Получить отчёт по сотруднику
router.get('/employee/:employeeId', async (req, res) => {
	try {
		const { employeeId } = req.params

		// Получаем все оценки сотрудника с критериями и категориями
		const evaluations = await Evaluation.findAll({
			where: { employeeId: parseInt(employeeId) },
			include: [
				{
					model: Criterion,
					include: [{ model: Category, attributes: ['id', 'name'] }],
				},
			],
		})

		// Группируем по категориям
		const categories = {}
		evaluations.forEach(e => {
			const categoryName = e.Criterion.Category.name
			if (!categories[categoryName]) {
				categories[categoryName] = { scores: [], criteria: [] }
			}
			categories[categoryName].scores.push(e.score)
			categories[categoryName].criteria.push({
				name: e.Criterion.name,
				score: e.score,
			})
		})

		// Считаем средние баллы
		const report = {}
		for (const [name, data] of Object.entries(categories)) {
			const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length
			report[name] = {
				average: Math.round(avg * 10) / 10,
				criteria: data.criteria,
			}
		}

		res.json(report)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

// Получить все отчёты (заглушка)
router.get('/', async (req, res) => {
	res.json({ message: 'Отчёты доступны по /reports/employee/{id}' })
})

module.exports = router
