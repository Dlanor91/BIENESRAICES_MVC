;(function name(params) {
  const lat = -34.915668
  const lng = -56.1620156
  const mapa = L.map('mapa-inicio').setView([lat, lng], 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa)
})()
