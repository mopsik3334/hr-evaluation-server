function renderRadarChart(canvasId, labels, data) {
	const ctx = document.getElementById(canvasId).getContext('2d')
	return new Chart(ctx, {
		type: 'radar',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Профиль качеств',
					data: data,
					backgroundColor: 'rgba(52, 152, 219, 0.2)',
					borderColor: 'rgba(52, 152, 219, 1)',
					pointBackgroundColor: 'rgba(52, 152, 219, 1)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgba(52, 152, 219, 1)',
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			scales: {
				r: {
					beginAtZero: true,
					max: 5,
					angleLines: {
						display: true,
					},
					pointLabels: {
						font: {
							size: 12,
						},
					},
				},
			},
			plugins: {
				legend: {
					position: 'top',
				},
			},
		},
	})
}

function renderBarChart(canvasId, labels, data) {
	const ctx = document.getElementById(canvasId).getContext('2d')
	return new Chart(ctx, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
				{
					label: 'Итоговые баллы',
					data: data,
					backgroundColor: ['#3498db', '#2ecc71'],
					borderColor: ['#2980b9', '#27ae60'],
					borderWidth: 1,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: true,
			scales: {
				y: {
					beginAtZero: true,
					max: 5,
					ticks: {
						stepSize: 1,
					},
				},
			},
			plugins: {
				legend: {
					position: 'top',
				},
			},
		},
	})
}
