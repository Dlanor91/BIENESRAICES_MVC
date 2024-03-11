import { validationResult } from 'express-validator'
import { Categoria, Precio, Propiedad } from '../models/index.js'
import e from 'express'

const admin = async (req, res) => {
  const { id } = req.usuario

  const propiedades = await Propiedad.findAll({
    where: {
      usuarioId: id,
    },
    include: [
      { model: Categoria, as: 'categoria' }, //aqui traigo los valores de SQL como un join
      { model: Precio, as: 'precio' },
    ],
  })

  res.render('propiedades/admin', {
    pagina: 'Mis propiedades',
    propiedades,
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
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  res.render('propiedades/agregar-imagen', {
    pagina: `Agregar Imagen ${propiedad.titulo}`,
    csrfToken: req.csrfToken(),
    propiedad,
  })
}

const almacenarImagen = async (req, res, next) => {
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
  if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
    return res.redirect('/mis-propiedades')
  }

  try {
    //Almacenar la imagen y publicar propiedad
    propiedad.imagen = req.file.filename
    propiedad.publicado = 1

    await propiedad.save()

    next()
  } catch (error) {
    console.log(error)
  }
}

const editar = async (req, res) =>{

  const { id } = req.params

  //Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if(!propiedad)
  {
    return res.redirect('/mis-propiedades')
  }

  //Revisar que quie nvisita la URL es quien creo la propiedad
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString())
  {
    return res.redirect('/mis-propiedades')
  }

  const [categorias, precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll(),
  ])

  res.render('propiedades/editar', {
    pagina: `Editar Propiedad: ${propiedad.titulo} `,
    csrfToken: req.csrfToken(),
    categorias,
    precios,
    datos: propiedad,
  })
}

const guardarCambios = async (req, res) =>{

  let resultado = validationResult(req)

  if (!resultado.isEmpty()) {
    const [categorias, precios] = await Promise.all([
      Categoria.findAll(),
      Precio.findAll(),
    ])

    return res.render('propiedades/editar', {
      pagina: 'Editar Propiedad',
      csrfToken: req.csrfToken(),
      categorias,
      precios,
      errores: resultado.array(),
      datos: req.body,
    })
  }

  const { id } = req.params

  //Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if(!propiedad)
  {
    return res.redirect('/mis-propiedades')
  }

  //Revisar que quie nvisita la URL es quien creo la propiedad
  if(propiedad.usuarioId.toString() !== req.usuario.id.toString())
  {
    return res.redirect('/mis-propiedades')
  }

  //Reescribir el objeto y actualizarlo
  try {
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
    } = req.body

    propiedad.set({ //permite setear el nuevo objeto que extraje
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      categoriaId,
      precioId,
      calle,
      lat,
      lng
    })

    await propiedad.save() //salva el valor nuevo en bd
    res.redirect('/mis-propiedades')

  } catch (error) {
    console.log(error)
  }
  
}

export { admin, crear, guardar, agregarImagen, almacenarImagen, editar, guardarCambios }
