// Глобальные переменные
let employees = []
let criteria = []
let editingEmployeeId = null

// Загрузка данных при старте страницы
async function loadEmployeesPage() {
	try {
		await checkAuth()

		employees = await api.getEmployees()
		criteria = await api.getCriteria()

		renderEmployeesTable()
	} catch (error) {
		showError('Ошибка загрузки данных: ' + error.message)
	}
}

// Отображение таблицы сотрудников
function renderEmployeesTable() {
	const tbody = document.querySelector('#employeesTable tbody')
	if (!tbody) return

	tbody.innerHTML = ''

	if (employees.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="4" style="text-align: center;">Сотрудников нет</td></tr>'
		return
	}

	employees.forEach(employee => {
		const row = document.createElement('tr')
		row.innerHTML = `
      <td>${employee.fullName || '—'}</td>
      <td>${employee.position || '—'}</td>
      <td>${employee.department || '—'}</td>
      <td>
        <button onclick="editEmployee(${employee.id})" class="btn btn-sm">Редактировать</button>
        <button onclick="deleteEmployee(${employee.id})" class="btn btn-sm danger">Удалить</button>
      </td>
    `
		tbody.appendChild(row)
	})
}

// Показать модальное окно добавления
function showAddEmployeeModal() {
	editingEmployeeId = null
	document.getElementById('modalTitle').textContent = 'Добавить сотрудника'
	document.getElementById('employeeId').value = ''
	document.getElementById('fullName').value = ''
	document.getElementById('position').value = ''
	document.getElementById('department').value = ''
	document.getElementById('addEmployeeModal').classList.remove('hidden')
}

// Закрыть модальное окно
function closeAddEmployeeModal() {
	document.getElementById('addEmployeeModal').classList.add('hidden')
	editingEmployeeId = null
}

// Редактирование сотрудника
async function editEmployee(id) {
	const employee = employees.find(e => e.id === id)
	if (!employee) return

	editingEmployeeId = id
	document.getElementById('modalTitle').textContent = 'Редактировать сотрудника'
	document.getElementById('employeeId').value = employee.id
	document.getElementById('fullName').value = employee.fullName || ''
	document.getElementById('position').value = employee.position || ''
	document.getElementById('department').value = employee.department || ''
	document.getElementById('addEmployeeModal').classList.remove('hidden')
}

// Сохранение сотрудника (добавление или обновление)
async function handleSaveEmployee(event) {
	event.preventDefault()

	const employeeData = {
		fullName: document.getElementById('fullName').value.trim(),
		position: document.getElementById('position').value.trim(),
		department: document.getElementById('department').value.trim(),
	}

	// Валидация
	if (!employeeData.fullName) {
		showError('ФИО обязательно для заполнения')
		return
	}

	try {
		if (editingEmployeeId) {
			// Обновление существующего
			await api.updateEmployee(editingEmployeeId, employeeData)
			showToast('Сотрудник обновлён')
		} else {
			// Добавление нового
			await api.createEmployee(employeeData)
			showToast('Сотрудник добавлен')
		}
		closeAddEmployeeModal()
		await loadEmployeesPage()
	} catch (error) {
		showError('Ошибка сохранения: ' + error.message)
	}
}

// Удаление сотрудника
async function deleteEmployee(id) {
	if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) return

	try {
		await api.deleteEmployee(id)
		showToast('Сотрудник удалён')
		await loadEmployeesPage()
	} catch (error) {
		showError('Ошибка удаления: ' + error.message)
	}
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', loadEmployeesPage)
