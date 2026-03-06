const Joi = require('joi')

const validateEmployee = (req, res, next) => {
	const schema = Joi.object({
		fullName: Joi.string().min(3).max(100).required(),
		position: Joi.string().max(100),
		department: Joi.string().max(100),
	})

	const { error } = schema.validate(req.body)
	if (error) {
		return res.status(400).json({ error: error.details[0].message })
	}
	next()
}

module.exports = validateEmployee
