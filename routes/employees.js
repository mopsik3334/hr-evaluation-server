const express = require('express')
const router = express.Router()
const employeeController = require('../controllers/employeeController')
const { verifyToken } = require('../middleware/auth')
const checkRole = require('../middleware/checkRole')

// Все маршруты защищены + проверка роли
router.use(verifyToken)
router.use(checkRole('HR', 'admin')) // Только HR и admin

router.get('/', employeeController.getAll)
router.post('/', employeeController.create)
router.get('/:id', employeeController.getById)
router.put('/:id', employeeController.update)
router.delete('/:id', employeeController.delete)

module.exports = router
