import { validationResult } from 'express-validator'
import { Categoria, Precio, Propiedad } from '../models/index.js'

const admin = (req, res) => {
  res.render('propiedades/admin', {
    pagina: 'Mis propiedades',
  })
}

const crear = async (req, res) => {
  //consultar modelo y categorias
  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ])

  res.render('propiedades/crear', {
    pagina: 'Crear propiedad',
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: {},
  })
}

const guardar = async (req, res) => {
  //Validacion
  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ])

    return res.render('propiedades/crear', {
      pagina: 'Crear Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    })
  }

  //crear un registro

  const {
    titulo,
    descripcion,
    habitaciones,
    estacionamiento,
    wc,
    calle,
    lat,
    lng,
    precio: precioId,
    categoria: categoriaId,
  } = req.body //precio: precioId renombra variable del body

  const { id: usuarioId } = req.usuario

  try {
    const propiedadGuardada = await Propiedad.create({
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      calle,
      lat,
      lng,
      precioId,
      categoriaId,
      usuarioId,
      imagen: '',
    })

    const { id } = propiedadGuardada

    res.redirect(`/propiedades/agregar-imagen/${id}`)
  } catch (error) {
    console.log(error)
  }
}

const agregarImagen = async (req, res) => {
  const { id } = req.params //viene en la url en el parametro

  //Valdiar que la propiedade exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Validar que no este publicada
  if (propiedad.publicado) {
    return res.redirect('/mis-propiedades')
  }

  //Validar que la propiedad pertenece al que visita la pagina y lo llevo a string para mejorar el CRM
  if( req.usuario.id.toString() !== propiedad.usuarioId.toString()){
    return res.redirect('/mis-propiedades')
  }

  res.render('propiedades/agregar-imagen', {
    pagina: 'Agregar Imagen',
  })
}

export { admin, crear, guardar, agregarImagen }
