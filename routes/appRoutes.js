import express from 'express'

import {
  inicio,
  categoria,
  NoEncontrado,
  buscador,
} from '../controllers/appController.js'

const router = express.Router()

//Pagina de Inicio
router.get('/', inicio)

//Categorias
router.get('/categorias/:id', categoria)

//Pagina 404
router.get('/404', NoEncontrado)

//Buscador
router.post('/buscador', buscador)

export default router
