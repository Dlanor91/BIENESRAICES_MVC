import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar Sesión',
  })
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crear Cuenta',
  })
}

const registrar = async (req, res) => {
  //validacion
  await check('nombre')
    .notEmpty()
    .withMessage('El nombre no puede ir vacío')
    .run(req)

  let resultado = validationResult(req)

  res.json(resultado.array())

  const usuario = await Usuario.create(req.body)

  res.json(usuario)
}

const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso a bienes raices',
  })
}

//varios export
//export default; //solo uno por archivo
export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
}
