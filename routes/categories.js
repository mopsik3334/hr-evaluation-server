const express = require('express')
const router = express.Router()
const { Category } = require('../models')
const { verifyToken } = require('../middleware/auth')
const checkRole = require('../middleware/checkRole')

// GET /api/categories - получить все категории (доступно всем авторизованным)
router.use(verifyToken)

router.get('/', async (req, res) => {
	try {
		let categories = await Category.findAll()

		// Если категорий нет, создаём стандартные
		if (categories.length === 0) {
			categories = await Promise.all([
				Category.create({ id: 1, name: 'Деловые' }),
				Category.create({ id: 2, name: 'Личностные' }),
			])
		}

		res.json(categories)
	} catch (error) {
		console.error('Ошибка получения категорий:', error)
		res.status(500).json({ error: error.message })
	}
})

// POST /api/categories - создать категорию (только HR/admin)
router.post('/', checkRole('HR', 'admin'), async (req, res) => {
	try {
		const { name } = req.body

		if (!name) {
			return res.status(400).json({ error: 'Название категории обязательно' })
		}

		const category = await Category.create({ name })
		res.status(201).json(category)
	} catch (error) {
		console.error('Ошибка создания категории:', error)
		res.status(500).json({ error: error.message })
	}
})

module.exports = router
