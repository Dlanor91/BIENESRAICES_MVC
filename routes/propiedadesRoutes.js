import express from 'express'
import { body } from 'express-validator'
import {
  admin,
  crear,
  guardar,
  agregarImagen,
  almacenarImagen,
  editar,
  guardarCambios,
  eliminar,
  mostrarPropiedad,
} from '../controllers/propiedadController.js'
import protegerRuta from '../middleware/protegerRuta.js'
import upload from '../middleware/subirImagen.js'

const router = express.Router()

router.get('/mis-propiedades', protegerRuta, admin) //url, luego middleware y luego function
router.get('/propiedades/crear', protegerRuta, crear)
router.post(
  '/propiedades/crear',
  protegerRuta,
  body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
  body('descripcion')
    .notEmpty()
    .withMessage('La descripcion no puede ir vacía.')
    .isLength({ max: 200 })
    .withMessage('La descripción no puede ser muy larga.'),
  body('categoria').isNumeric().withMessage('Selecciona una categoría.'),
  body('precio').isNumeric().withMessage('Selecciona un rango de precios.'),
  body('habitaciones')
    .isNumeric()
    .withMessage('Selecciona la cantidad de Habitaciones.'),
  body('estacionamiento')
    .isNumeric()
    .withMessage('Selecciona la cantidad de Estacionamientos.'),
  body('wc').isNumeric().withMessage('Selecciona la cantidad de Baños.'),
  body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa.'),
  guardar,
)

router.get('/propiedades/agregar-imagen/:id', protegerRuta, agregarImagen)
router.post(
  '/propiedades/agregar-imagen/:id',
  protegerRuta,
  upload.single('imagen'), //solo una imagen y se usa como middleware
  almacenarImagen,
)

router.get('/propiedades/editar/:id', protegerRuta, editar)

router.post(
  '/propiedades/editar/:id',
  protegerRuta,
  body('titulo').notEmpty().withMessage('El título del anuncio es obligatorio'),
  body('descripcion')
    .notEmpty()
    .withMessage('La descripcion no puede ir vacía.')
    .isLength({ max: 200 })
    .withMessage('La descripción no puede ser muy larga.'),
  body('categoria').isNumeric().withMessage('Selecciona una categoría.'),
  body('precio').isNumeric().withMessage('Selecciona un rango de precios.'),
  body('habitaciones')
    .isNumeric()
    .withMessage('Selecciona la cantidad de Habitaciones.'),
  body('estacionamiento')
    .isNumeric()
    .withMessage('Selecciona la cantidad de Estacionamientos.'),
  body('wc').isNumeric().withMessage('Selecciona la cantidad de Baños.'),
  body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa.'),
  guardarCambios,
)

router.post('/propiedades/eliminar/:id', protegerRuta, eliminar)

//Area Publica
router.get('/propiedades/:id', mostrarPropiedad)

export default router
