import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Categoria, Precio, Propiedad } from '../models/index.js'

const admin = async (req, res) => {
  //Leer QueryString
  const { pagina: paginaActual } = req.query

  const expresion = /^[1-9]$/ //expresion regular que valida si es un digito

  if (!expresion.test(paginaActual)) {
    //este test devuelve true o false cuando le pasas la expresion regular
    return res.redirect('/mis-propiedades?pagina=1')
  }

  try {
    const { id } = req.usuario

    //Limites y offset para el paginador
    const limit = 4
    const offset = paginaActual * limit - limit

    const [propiedades, total] = await Promise.all([
      await Propiedad.findAll({
        limit, //como el limite de sql
        offset,
        where: {
          usuarioId: id,
        },
        include: [
          { model: Categoria, as: 'categoria' }, //aqui traigo los valores de SQL como un join
          { model: Precio, as: 'precio' },
        ],
        order: [
          [{ model: Categoria, as: 'categoria' }, 'nombre', 'ASC'],
          [{ model: Precio, as: 'precio' }, 'id', 'ASC'],
        ],
      }),
      Propiedad.count({
        where: {
          usuarioId: id,
        },
      }),
    ])

    res.render('propiedades/admin', {
      pagina: 'Mis propiedades',
      propiedades,
      csrfToken: req.csrfToken(),
      paginas: Math.ceil(total / limit),
      paginaActual: Number(paginaActual),
      total,
      offset,
      limit,
    })
  } catch (error) {
    console.log(error)
  }
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

const editar = async (req, res) => {
  const { id } = req.params

  //Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Revisar que quie nvisita la URL es quien creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
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

const guardarCambios = async (req, res) => {
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

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Revisar que quie nvisita la URL es quien creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
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

    propiedad.set({
      //permite setear el nuevo objeto que extraje
      titulo,
      descripcion,
      habitaciones,
      estacionamiento,
      wc,
      categoriaId,
      precioId,
      calle,
      lat,
      lng,
    })

    await propiedad.save() //salva el valor nuevo en bd
    res.redirect('/mis-propiedades')
  } catch (error) {
    console.log(error)
  }
}

const eliminar = async (req, res) => {
  const { id } = req.params

  //Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id)

  if (!propiedad) {
    return res.redirect('/mis-propiedades')
  }

  //Revisar que quie nvisita la URL es quien creo la propiedad
  if (propiedad.usuarioId.toString() !== req.usuario.id.toString()) {
    return res.redirect('/mis-propiedades')
  }

  //Eliminar la imagen asociada
  if (propiedad.imagen.length > 0) {
    await unlink(`public/uploads/${propiedad.imagen}`)
  }

  //Eliminar la propiedad
  await propiedad.destroy()
  res.redirect('/mis-propiedades')
}

//Muestra una propiedad
const mostrarPropiedad = async (req, res) => {
  const { id } = req.params

  //Validar que la propiedad exista
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      { model: Precio, as: 'precio' },
      { model: Categoria, as: 'categoria' },
    ],
  })

  if (!propiedad) {
    return res.redirect('/404')
  }

  res.render('propiedades/mostrar', {
    propiedad,
    pagina: propiedad.titulo,
  })
}

export {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad,
}
