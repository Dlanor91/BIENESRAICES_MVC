import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarJWT, generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'

import bcrypt from 'bcrypt'

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Iniciar Sesión',
    csrfToken: req.csrfToken(),
  })
}

const autenticar = async (req, res) => {
  //Validación
  await check('email').isEmail().withMessage('El email es obligatorio').run(req)

  await check('password')
    .notEmpty()
    .withMessage('El Password es obligatorio')
    .run(req)

  let resultado = validationResult(req)

  //Verificar que el resultado no este vacío, o sea hay errores
  if (!resultado.isEmpty()) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    })
  }

  const { email, password } = req.body

  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ where: { email } })
  if (!usuario) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El usuario ´no existe' }],
    })
  }

  //Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'Tu cuenta no ha sido confirmada' }],
    })
  }

  //Revisar el password
  if (!usuario.verificarPassword(password)) {
    return res.render('auth/login', {
      pagina: 'Iniciar Sesión',
      csrfToken: req.csrfToken(),
      errores: [{ msg: 'El password es incorrecto' }],
    })
  }

  //Autenticar al usuario
  const token = generarJWT({ id: usuario.id, nombre: usuario.nombre })

  console.log(token)

  //Almacenar en un cookie
  return res
    .cookie('_token', token, {
      httpOnly: true, //que no sea accesible al cookie
      //secure: true //para certificados ssl
      //sameSite:true //para que se use con otros sitios
    })
    .redirect('/mis-propiedades')
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

const nuevoPassword = async (req, res) => {
  //Validar Password
  await check('password')
    .isLength({ min: 6 })
    .withMessage('El password debe ser de al menos 6 caracteres')
    .run(req)

  let resultado = validationResult(req)

  //Verificar que el resultado no este vacío, o sea hay errores
  if (!resultado.isEmpty()) {
    return res.render('auth/reset-password', {
      pagina: 'Restablece tu Password',
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    })
  }

  const { token } = req.params
  const { password } = req.body

  //Identificar quien hace el cambio
  const usuario = await Usuario.findOne({ where: { token } })

  //Hashear el password
  const salt = await bcrypt.genSalt(10) //rondas de hash
  usuario.password = await bcrypt.hash(password, salt)
  usuario.token = null

  await usuario.save()

  res.render('auth/confirmar-cuenta', {
    pagina: 'Password reestablecido',
    mensaje: 'El password se guardo correctamente',
  })
}
//varios export
//export default; //solo uno por archivo
export {
  formularioLogin,
  autenticar,
  formularioRegistro,
  formularioOlvidePassword,
  confirmar,
  registrar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
}
