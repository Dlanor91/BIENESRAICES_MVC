;(function () {
  const lat = -34.915668
  const lng = -56.1620156
  const mapa = L.map('mapa').setView([lat, lng], 14)
  let marker

  //Utilizar Provider y Geocoder
  const geocodeService = L.esri.Geocoding.geocodeService()

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa)

  //el pin
  marker = new L.marker([lat, lng], {
    draggable: true,
    autoPan: true,
  }).addTo(mapa)

  //Detectar el movimiento del pin
  marker.on('moveend', function (event) {
    marker = event.target

    const posicion = marker.getLatLng()

    mapa.panTo(new L.LatLng(posicion.lat, posicion.lng)) //centra el mapa

    //Obtener la información de las calles al obtener el pin
    geocodeService
      .reverse()
      .latlng(posicion, 13)
      .run(function (error, resultado) {
        marker.bindPopup(resultado.address.LongLabel)

        //Llenar los campos
        document.querySelector('.calle').textContent =
          resultado?.address?.Address ?? ''
        document.querySelector('#calle').textCvalueontent =
          resultado?.address?.Address ?? ''
        document.querySelector('#lat').textCvalueontent =
          resultado?.latlng?.lat ?? ''
        document.querySelector('#lng').textCvalueontent =
          resultado?.latlng?.lng ?? ''
      })
  })
})()
