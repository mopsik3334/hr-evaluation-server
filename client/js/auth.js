// Проверка аутентификации при загрузке страницы
async function checkAuth() {
	const token = localStorage.getItem('token')
	const user = JSON.parse(localStorage.getItem('user'))

	if (!token) {
		window.location.href = 'index.html'
		return false
	}

	// Проверяем роль и перенаправляем на нужную страницу
	const currentPage = window.location.pathname.split('/').pop()

	if (user.role === 'user') {
		// Обычные пользователи могут смотреть только отчёты
		if (currentPage !== 'reports.html' && currentPage !== '') {
			window.location.href = 'reports.html'
			return false
		}
	} else {
		// Admin и HR могут смотреть все страницы
		if (!currentPage || currentPage === '') {
			window.location.href = 'employees.html'
		}
	}

	return true
}

// Выход из системы
function logout() {
	localStorage.removeItem('token')
	localStorage.removeItem('user')
	window.location.href = 'index.html'
}

// Вход в систему (для index.html)
async function login(username, password) {
	try {
		const response = await fetch('http://localhost:3000/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error || 'Ошибка входа')
		}

		// Сохраняем токен и данные пользователя
		localStorage.setItem('token', data.token)
		localStorage.setItem('user', JSON.stringify(data.user))

		// Перенаправляем в зависимости от роли
		if (data.user.role === 'user') {
			window.location.href = 'reports.html'
		} else {
			window.location.href = 'employees.html'
		}

		return true
	} catch (error) {
		console.error('Ошибка входа:', error)
		throw error
	}
}

// Проверка роли пользователя
function hasRole(...roles) {
	const user = JSON.parse(localStorage.getItem('user'))
	if (!user || !user.role) return false
	return roles.includes(user.role)
}

// Проверка доступа к странице
function checkPageAccess(allowedRoles) {
	const token = localStorage.getItem('token')
	const user = JSON.parse(localStorage.getItem('user'))

	if (!token) {
		window.location.href = 'index.html'
		return false
	}

	if (allowedRoles && !allowedRoles.includes(user.role)) {
		// Перенаправляем на страницу отчётов (единственная доступная)
		window.location.href = 'reports.html'
		return false
	}

	return true
}

// Обновление навигации в зависимости от роли
function updateNavigation() {
	const user = JSON.parse(localStorage.getItem('user'))
	if (!user) return

	// Если пользователь с ролью 'user', скрываем ссылки на редактирование
	if (user.role === 'user') {
		const employeesLink = document.querySelector('nav a[href="employees.html"]')
		const criteriaLink = document.querySelector('nav a[href="criteria.html"]')
		const evaluateLink = document.querySelector('nav a[href="evaluate.html"]')

		if (employeesLink) employeesLink.style.display = 'none'
		if (criteriaLink) criteriaLink.style.display = 'none'
		if (evaluateLink) evaluateLink.style.display = 'none'
	}
}

// Экспорт функций
window.checkAuth = checkAuth
window.logout = logout
window.login = login
window.hasRole = hasRole
window.checkPageAccess = checkPageAccess
window.updateNavigation = updateNavigation
