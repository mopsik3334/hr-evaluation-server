// Базовый URL API
const API_URL = 'http://localhost:3000/api'

// Вспомогательная функция для fetch запросов
async function apiRequest(endpoint, options = {}) {
	const token = localStorage.getItem('token')

	const config = {
		...options,
		headers: {
			'Content-Type': 'application/json',
			Authorization: token ? `Bearer ${token}` : '',
			...options.headers,
		},
	}

	try {
		const response = await fetch(`${API_URL}${endpoint}`, config)

		// Если токен истёк
		if (response.status === 401) {
			localStorage.removeItem('token')
			localStorage.removeItem('user')
			window.location.href = 'index.html'
			throw new Error('Сессия истекла')
		}

		// Если доступа нет
		if (response.status === 403) {
			throw new Error('Недостаточно прав доступа')
		}

		// Обрабатываем пустые ответы (204 No Content)
		if (response.status === 204) {
			return null
		}

		// Проверяем, что ответ содержит JSON
		const contentType = response.headers.get('content-type')
		if (contentType && contentType.includes('application/json')) {
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Ошибка запроса')
			}

			return data
		}

		// Если ответ не JSON и не 204
		if (!response.ok) {
			const text = await response.text()
			throw new Error(text || `Ошибка HTTP: ${response.status}`)
		}

		return null
	} catch (error) {
		console.error(`API Error (${endpoint}):`, error)
		throw error
	}
}

// ==================== СОТРУДНИКИ ====================

async function getEmployees() {
	return await apiRequest('/employees')
}

async function getEmployeeById(id) {
	return await apiRequest(`/employees/${id}`)
}

async function createEmployee(employeeData) {
	return await apiRequest('/employees', {
		method: 'POST',
		body: JSON.stringify(employeeData),
	})
}

async function updateEmployee(id, employeeData) {
	return await apiRequest(`/employees/${id}`, {
		method: 'PUT',
		body: JSON.stringify(employeeData),
	})
}

async function deleteEmployee(id) {
	return await apiRequest(`/employees/${id}`, {
		method: 'DELETE',
	})
}

// ==================== ПУБЛИЧНЫЕ ЭНДПОИНТЫ (для всех авторизованных) ====================

// Получить базовый список сотрудников (доступно всем)
async function getEmployeesBasic() {
	return await apiRequest('/public/employees')
}

// Получить критерии (доступно всем)
async function getCriteriaPublic() {
	return await apiRequest('/public/criteria')
}

// Получить оценки сотрудника (доступно всем)
async function getEvaluationsPublic(employeeId) {
	return await apiRequest(`/public/evaluations/${employeeId}`)
}

// ==================== КАТЕГОРИИ ====================

async function getCategories() {
  return await apiRequest('/categories')
}

async function createCategory(categoryData) {
  return await apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData)
  })
}

// ==================== КРИТЕРИИ ====================

async function getCriteria() {
	return await apiRequest('/criteria')
}

async function createCriterion(criterionData) {
	return await apiRequest('/criteria', {
		method: 'POST',
		body: JSON.stringify(criterionData),
	})
}

async function updateCriterion(id, criterionData) {
	return await apiRequest(`/criteria/${id}`, {
		method: 'PUT',
		body: JSON.stringify(criterionData),
	})
}

async function deleteCriterion(id) {
	return await apiRequest(`/criteria/${id}`, {
		method: 'DELETE',
	})
}

// ==================== ОЦЕНКИ ====================

async function getEvaluations(employeeId) {
	return await apiRequest(`/evaluations/employee/${employeeId}`)
}

async function createEvaluation(evaluationData) {
	return await apiRequest('/evaluations', {
		method: 'POST',
		body: JSON.stringify(evaluationData),
	})
}

async function updateEvaluation(id, evaluationData) {
	return await apiRequest(`/evaluations/${id}`, {
		method: 'PUT',
		body: JSON.stringify(evaluationData),
	})
}

async function deleteEvaluation(id) {
	return await apiRequest(`/evaluations/${id}`, {
		method: 'DELETE',
	})
}

async function getAllEvaluations() {
	return await apiRequest('/evaluations')
}

// ==================== ОТЧЁТЫ ====================

async function getReport(employeeId) {
	return await apiRequest(`/reports/employee/${employeeId}`)
}

async function getAllReports() {
	return await apiRequest('/reports')
}

// ==================== ЭКСПОРТ ФУНКЦИЙ ====================

window.api = {
	// Сотрудники
	getEmployees,
	getEmployeeById,
	createEmployee,
	updateEmployee,
	deleteEmployee,

	// Публичные эндпоинты
	getEmployeesBasic,
	getCriteriaPublic,
	getEvaluationsPublic,

	// Категории
	getCategories,
	createCategory,
	

	// Критерии
	getCriteria,
	createCriterion,
	updateCriterion,
	deleteCriterion,

	// Оценки
	getEvaluations,
	createEvaluation,
	updateEvaluation,
	deleteEvaluation,
	getAllEvaluations,

	// Отчёты
	getReport,
	getAllReports,
}
