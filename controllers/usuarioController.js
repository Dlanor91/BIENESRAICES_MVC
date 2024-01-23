import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar Sesión',
  })
}

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crear Cuenta',
    csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario ya esta registrado' }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    })
  }

  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  })

  //Envia email de confirmacion
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  })

  //mostrar mensaje de confirmacion de email
  res.render('templates/mensaje', {
    pagina: 'Cuenta creada correctamente',
    mensaje: 'Hemos enviado un Email de confirmacion, presiona en el enlace',
  })
}

//funcion q comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params //leo el valor de la url

  //verificar si es valido o no el token
  const usuario = await Usuario.findOne({
    where: { token },
  })

  if (!usuario) {
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Error al confirmar tu cuenta',
      mensaje: 'Hubo un error al confirmar tu cuenta, intentelo de nuevo',
      error: true,
    })
  }

  //Confirmar la cuenta
  usuario.token = null
  usuario.confirmado = true

  await usuario.save()

  return res.render('auth/confirmar-cuenta', {
    pagina: 'Cuenta confirmada',
    mensaje: 'La cuenta se confirmo correctamente',
  })
}

const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso a bienes raices',
    csrfToken: req.csrfToken(),
  })
}

const resetPassword = async (req, res) => {
  //validacion
  await check('email')
    .notEmpty()
    .withMessage('El email no puede ir vacío')
    .run(req)

  let resultado = validationResult(req)

  //Verificar que el resultado no este vacío, o sea hay errores
  if (!resultado.isEmpty()) {
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tu acceso a bienes raices',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    })
  }

  //Buscar el usuario
  const { email } = req.body

  const usuario = await Usuario.findOne({ where: { email } })

  if (!usuario) {
    return res.render('auth/olvide-password', {
      pagina: 'Recupera tu acceso a bienes raices',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El email no pertenece a ningún usuario' }],
    })
  }

  //Generar un token y enviar el email
  usuario.token = generarId()
  await usuario.save()

  //Enviar un email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  })

  //Renderizar un mensaje
  //mostrar mensaje de confirmacion de email
  res.render('templates/mensaje', {
    pagina: 'Reestablece tu Password',
    mensaje: 'Hemos enviado un Email con las instrucciones',
  })
}

const comprobarToken = async (req, res) => {
  const { token } = req.params

  const usuario = await Usuario.findOne({ where: { token } })

  if (!usuario)
    return res.render('auth/confirmar-cuenta', {
      pagina: 'Reestablece tu password',
      mensaje: 'Hubo un error al validar tu informacion, intenta de nuevo',
      error: true,
    })

  //Mostrar formulario para modificar el password
  res.render('auth/reset-password', {
    pagina: 'Reestablece tu password',
    csrfToken: req.csrfToken(),
  })
}

const nuevoPassword = (req, res) => {
  console.log('GG')
}
//varios export
//export default; //solo uno por archivo
export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  confirmar,
  registrar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
}
