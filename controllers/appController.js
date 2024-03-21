import { Precio, Categoria, Propiedad } from '../models/index.js'

const inicio = async (req, res) => {
  const [categorias, precios] = await Promise.all([
    Categoria.findAll({ raw: true }),
    Precio.findAll({ raw: true }),
  ])

  res.render('inicio', {
    pagina: 'Home',
    categorias,
    precios,
  })
}

const categoria = (req, res) => {}

const NoEncontrado = (req, res) => {}

const buscador = (req, res) => {}

export { inicio, categoria, NoEncontrado, buscador }
