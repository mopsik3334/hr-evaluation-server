const { Employee, Evaluation, Criterion, Category } = require('../models')

//  ПОЛУЧЕНИЕ ВСЕХ СОТРУДНИКОВ
exports.getAll = async (req, res) => {
	try {
		const employees = await Employee.findAll({
			include: [
				{
					model: Evaluation,
					as: 'employeeEvaluations', // ← ИСПРАВЛЕНО! (было 'evaluations')
					attributes: ['score', 'criterionId'],
					include: [
						{
							model: Criterion,
							as: 'criterion', // ← Правильно!
							attributes: ['name', 'categoryId'],
							include: [
								{
									model: Category,
									as: 'category', // ← Правильно!
									attributes: ['name'],
								},
							],
						},
					],
				},
			],
		})
		res.json(employees)
	} catch (error) {
		console.error('Ошибка получения сотрудников:', error)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
}

//  СОЗДАНИЕ СОТРУДНИКА
exports.create = async (req, res) => {
	try {
		const { fullName, position, department } = req.body

		// Валидация обязательных полей
		if (!fullName) {
			return res.status(400).json({ error: 'ФИО обязательно' })
		}

		const employee = await Employee.create({
			fullName,
			position,
			department,
		})

		res.status(201).json(employee)
	} catch (error) {
		console.error('Ошибка создания сотрудника:', error)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
}

//  ОБНОВЛЕНИЕ СОТРУДНИКА
exports.update = async (req, res) => {
	try {
		const { id } = req.params
		const { fullName, position, department } = req.body

		// Ищем сотрудника
		const employee = await Employee.findByPk(id)
		if (!employee) {
			return res.status(404).json({ error: 'Сотрудник не найден' })
		}

		// Обновляем поля
		await employee.update({
			fullName,
			position,
			department,
		})

		res.json(employee)
	} catch (error) {
		console.error('Ошибка обновления сотрудника:', error)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
}

//  УДАЛЕНИЕ СОТРУДНИКА
exports.delete = async (req, res) => {
	try {
		const { id } = req.params

		const employee = await Employee.findByPk(id)
		if (!employee) {
			return res.status(404).json({ error: 'Сотрудник не найден' })
		}

		// Удаляем (связанные оценки удалятся автоматически благодаря CASCADE)
		await employee.destroy()

		res.status(204).send() // 204 No Content — успешное удаление без тела ответа
	} catch (error) {
		console.error('Ошибка удаления сотрудника:', error)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
}

//  ПОЛУЧЕНИЕ ОДНОГО СОТРУДНИКА
exports.getById = async (req, res) => {
	try {
		const { id } = req.params

		const employee = await Employee.findByPk(id, {
			include: [
				{
					model: Evaluation,
					as: 'employeeEvaluations', // ← ИСПРАВЛЕНО! (было 'evaluations')
					include: [
						{
							model: Criterion,
							as: 'criterion', // ← Правильно!
							attributes: ['name', 'categoryId'],
							include: [
								{
									model: Category,
									as: 'category', // ← Правильно!
									attributes: ['name'],
								},
							],
						},
					],
				},
			],
		})

		if (!employee) {
			return res.status(404).json({ error: 'Сотрудник не найден' })
		}

		res.json(employee)
	} catch (error) {
		console.error('Ошибка получения сотрудника:', error)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
}
