import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js'

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

  await check('email')
    .notEmpty()
    .withMessage('El email no puede ir vacío')
    .run(req)

  await check('email')
    .isEmail()
    .withMessage('El email no tiene un formato válido')
    .run(req)

  await check('password')
    .isLength({ min: 6 })
    .withMessage('El password debe ser de al menos 6 caracteres')
    .run(req)

  await check('repetir_password')
    .equals(req.body.password)
    .withMessage('Los passwords deben ser iguales')
    .run(req)

  let resultado = validationResult(req)

  //Verificar que el resultado no este vacío, o sea hay errores
  if (!resultado.isEmpty()) {
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    })
  }

  //Extrar los datos
  const { nombre, email, password } = req.body

  //Verificar que el usuario no este duplicado
  const existeUsuario = await Usuario.findOne({ where: { email: email } })
  if (existeUsuario) {
    return res.render('auth/registro', {
      pagina: 'Crear Cuenta',
      errores: [{ msg: 'El usuario ya esta registrado' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    })
  }

  await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  })
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
