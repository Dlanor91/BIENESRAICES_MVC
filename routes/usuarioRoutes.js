import express from 'express'
import {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  confirmar,
  registrar,
} from '../controllers/usuarioController.js'

const router = express.Router()

//Routing
router.get('/login', formularioLogin)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar) //luego de la diagonal si tiene : es varible

router.get('/olvide-Password', formularioOlvidePassword)

export default router
