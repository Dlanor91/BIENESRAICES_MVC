;(function name(params) {
  const lat = -34.915668
  const lng = -56.1620156
  const mapa = L.map('mapa-inicio').setView([lat, lng], 14)

  let markers = new L.FeatureGroup().addTo(mapa)

  //Filtros
  const filtros = {
    categoria: '',
    precio: '',
  }

  const categoriasSelect = document.querySelector('#categorias')
  const preciosSelect = document.querySelector('#precios')

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(mapa)

  //Filtrado de Categorias
  categoriasSelect.addEventListener('change', (e) => {
    filtros.categoria = +e.target.value
  })

  preciosSelect.addEventListener('change', (e) => {
    filtros.precio = +e.target.value
  })

  const obtenerPropieades = async () => {
    try {
      const url = '/api/propiedades'
      const respuesta = await fetch(url)

      const propiedades = await respuesta.json()

      mostrarPropiedades(propiedades)
    } catch (error) {
      console.log(error)
    }
  }

  const mostrarPropiedades = (propiedades) => {
    propiedades.forEach((propiedad) => {
      //Agregar los pines
      const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
        autoPan: true,
      }).addTo(mapa).bindPopup(`
        <p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}</p>
         <h2 class="text-xl font-extrabold uppercase my-5">${propiedad?.titulo}</h2>
         <img src="/uploads/${propiedad?.imagen}" alt="${propiedad?.titulo}" class="rounded">
         <p class="text-gray-600 font-bold">${propiedad?.precio.nombre}</p>
         <a href="/propiedades/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
         `)

      markers.addLayer(marker)
    })
  }

  obtenerPropieades()
})()
