// Показ уведомления
function showToast(message, type = 'success') {
	const toast = document.createElement('div')
	toast.className = `notification ${type}`
	toast.textContent = message
	toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem;
    border-radius: 4px;
    z-index: 1000;
    background-color: ${type === 'success' ? '#d5f5e3' : '#f9e7e7'};
    border-left: 4px solid ${type === 'success' ? '#2ecc71' : '#e74c3c'};
    font-family: system-ui, -apple-system, sans-serif;
  `

	document.body.appendChild(toast)

	// Удаляем через 3 секунды
	setTimeout(() => {
		toast.remove()
	}, 3000)
}

// Форматирование даты
function formatDate(date) {
	return new Date(date).toISOString().split('T')[0]
}

// Показ ошибки
function showError(message) {
	showToast(message, 'error')
}
