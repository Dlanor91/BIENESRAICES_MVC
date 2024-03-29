import express from 'express'
import {
  formularioLogin,
  autenticar,
  formularioRegistro,
  formularioOlvidePassword,
  confirmar,
  registrar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
} from '../controllers/usuarioController.js'

const router = express.Router()

//Routing
router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)

router.get('/confirmar/:token', confirmar) //luego de la diagonal si tiene : es varible

router.get('/olvide-password', formularioOlvidePassword)

router.post('/olvide-password', resetPassword)

//Almacenar el nuevo password
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

export default router
