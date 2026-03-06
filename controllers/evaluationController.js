const { Evaluation, Employee, Criterion, Category, User } = require('../models')

// Получить все оценки сотрудника
exports.getByEmployee = async (req, res) => {
	try {
		const { employeeId } = req.params
		const evaluations = await Evaluation.findAll({
			where: { employeeId },
			include: [
				{
					model: Criterion,
					as: 'criterion',
					include: [{ model: Category, as: 'category' }],
				},
			],
		})
		res.json(evaluations)
	} catch (error) {
		console.error('Ошибка получения оценок:', error)
		res.status(500).json({ error: error.message })
	}
}

// Создать оценку
exports.create = async (req, res) => {
	try {
		const { employeeId, criterionId, score } = req.body

		// Валидация
		if (!employeeId || !criterionId || !score) {
			return res.status(400).json({ error: 'Все поля обязательны' })
		}

		if (score < 1 || score > 5) {
			return res.status(400).json({ error: 'Оценка должна быть от 1 до 5' })
		}

		// Проверяем, существует ли уже оценка
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
}

// Обновить оценку
exports.update = async (req, res) => {
	try {
		const { id } = req.params
		const { score } = req.body

		if (!score || score < 1 || score > 5) {
			return res.status(400).json({ error: 'Оценка должна быть от 1 до 5' })
		}

		const [updated] = await Evaluation.update({ score }, { where: { id } })

		if (updated) {
			const evaluation = await Evaluation.findByPk(id, {
				include: [
					{
						model: Criterion,
						as: 'criterion',
						include: [{ model: Category, as: 'category' }],
					},
				],
			})
			return res.json(evaluation)
		}

		res.status(404).json({ error: 'Оценка не найдена' })
	} catch (error) {
		console.error('Ошибка обновления оценки:', error)
		res.status(500).json({ error: error.message })
	}
}

// Удалить оценку
exports.delete = async (req, res) => {
	try {
		const { id } = req.params
		const deleted = await Evaluation.destroy({
			where: { id },
		})

		if (deleted) {
			return res.status(204).send()
		}

		res.status(404).json({ error: 'Оценка не найдена' })
	} catch (error) {
		console.error('Ошибка удаления оценки:', error)
		res.status(500).json({ error: error.message })
	}
}

// Получить все оценки (для отчётов)
exports.getAll = async (req, res) => {
	try {
		const evaluations = await Evaluation.findAll({
			include: [
				{
					model: Employee,
					attributes: ['id', 'fullName', 'position', 'department'],
				},
				{
					model: Criterion,
					as: 'criterion',
					include: [{ model: Category, as: 'category' }],
				},
			],
		})
		res.json(evaluations)
	} catch (error) {
		console.error('Ошибка получения всех оценок:', error)
		res.status(500).json({ error: error.message })
	}
}
