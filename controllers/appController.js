const inicio = (req, res) => {
  res.render('inicio', {
    pagina: 'Home',
  })
}

const categoria = (req, res) => {}

const NoEncontrado = (req, res) => {}

const buscador = (req, res) => {}

export { inicio, categoria, NoEncontrado, buscador }
