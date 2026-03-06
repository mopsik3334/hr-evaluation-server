const { Criterion, Category } = require('../models')

exports.getAll = async (req, res) => {
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
}

exports.create = async (req, res) => {
	try {
		const criterion = await Criterion.create(req.body)
		res.status(201).json(criterion)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

exports.update = async (req, res) => {
	try {
		const [updated] = await Criterion.update(req.body, {
			where: { id: req.params.id },
		})
		if (updated) {
			const criterion = await Criterion.findByPk(req.params.id, {
				include: [{ model: Category, as: 'category' }],
			})
			return res.json(criterion)
		}
		res.status(404).json({ error: 'Критерий не найден' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}

exports.delete = async (req, res) => {
	try {
		const deleted = await Criterion.destroy({
			where: { id: req.params.id },
		})
		if (deleted) {
			return res.status(204).send()
		}
		res.status(404).json({ error: 'Критерий не найден' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
}
