import express from 'express'
import { body } from 'express-validator'
import { admin, crear, guardar } from '../controllers/propiedadController.js'

const router = express.Router()

router.get('/propiedades', admin)
router.get('/propiedades/crear', crear)
router.post(
  '/propiedades/crear',
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

export default router
