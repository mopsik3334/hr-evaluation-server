const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database.sqlite',
	logging: false,
})

// ==================== МОДЕЛИ ====================

const User = sequelize.define('User', {
	username: { type: DataTypes.STRING, unique: true, allowNull: false },
	passwordHash: { type: DataTypes.STRING, allowNull: false },
	role: { type: DataTypes.STRING, defaultValue: 'HR' },
})

const Employee = sequelize.define('Employee', {
	fullName: { type: DataTypes.STRING, allowNull: false },
	position: DataTypes.STRING,
	department: DataTypes.STRING,
})

const Category = sequelize.define('Category', {
	name: { type: DataTypes.STRING, unique: true },
})

const Criterion = sequelize.define('Criterion', {
	name: { type: DataTypes.STRING, allowNull: false },
	// categoryId будет создан автоматически через связь (не определяем здесь!)
})

const Evaluation = sequelize.define('Evaluation', {
	score: { type: DataTypes.INTEGER, allowNull: false },
	employeeId: { type: DataTypes.INTEGER, allowNull: false },
	criterionId: { type: DataTypes.INTEGER, allowNull: false },
	evaluatedBy: { type: DataTypes.INTEGER, allowNull: false },
})

// ==================== СВЯЗИ (с явным foreignKey и уникальными алиасами!) ====================

// Category ↔ Criterion
Category.hasMany(Criterion, {
	foreignKey: 'categoryId',
	as: 'criteria',
	onDelete: 'CASCADE',
})
Criterion.belongsTo(Category, {
	foreignKey: 'categoryId',
	as: 'category',
})

// Employee ↔ Evaluation
Employee.hasMany(Evaluation, {
	foreignKey: 'employeeId',
	as: 'employeeEvaluations',
	onDelete: 'CASCADE',
})
Evaluation.belongsTo(Employee, {
	foreignKey: 'employeeId',
	as: 'employee',
})

// Criterion ↔ Evaluation
Criterion.hasMany(Evaluation, {
	foreignKey: 'criterionId',
	as: 'criterionEvaluations',
	onDelete: 'CASCADE',
})
Evaluation.belongsTo(Criterion, {
	foreignKey: 'criterionId',
	as: 'criterion',
})

// User ↔ Evaluation
User.hasMany(Evaluation, {
	foreignKey: 'evaluatedBy',
	as: 'userEvaluations',
	onDelete: 'CASCADE',
})
Evaluation.belongsTo(User, {
	foreignKey: 'evaluatedBy',
	as: 'evaluator',
})

// ==================== ЭКСПОРТ ====================

module.exports = {
	sequelize,
	User,
	Employee,
	Category,
	Criterion,
	Evaluation,
}
