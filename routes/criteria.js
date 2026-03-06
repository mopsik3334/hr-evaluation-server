const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/auth')
const checkRole = require('../middleware/checkRole')
const { Criterion, Category } = require('../models')

router.use(verifyToken)
router.use(checkRole('HR', 'admin'))

router.get('/', async (req, res) => {
	try {
		const criteria = await Criterion.findAll({
			include: [
				{ model: Category, as: 'category', attributes: ['id', 'name'] },
			],
		})
		res.json(criteria)
	} catch (error) {
		console.error('Ошибка получения критериев:', error)
		res.status(500).json({ error: error.message })
	}
})

router.post('/', async (req, res) => {
	try {
		const criterion = await Criterion.create(req.body)
		res.status(201).json(criterion)
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

router.put('/:id', async (req, res) => {
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
})

router.delete('/:id', async (req, res) => {
	try {
		const deleted = await Criterion.destroy({ where: { id: req.params.id } })
		if (deleted) {
			return res.status(204).send()
		}
		res.status(404).json({ error: 'Критерий не найден' })
	} catch (error) {
		res.status(500).json({ error: error.message })
	}
})

module.exports = router
