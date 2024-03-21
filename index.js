//Inicia el server como tipo express
//const express = require("express"); con common js

import express from 'express' //con ems module
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js' //Importo el routing de usuarios
import propiedadesRoutes from './routes/propiedadesRoutes.js' //Importo el routing de propiedades
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

//Crear la app
const app = express()

//Habilitar lectura de datos del formulario pero no archivos
app.use(express.urlencoded({ extended: true }))

//Habilitar Cookie Parser
app.use(cookieParser())

//Habilitar CSRF
app.use(csrf({ cookie: true }))

//Conexion a la base de datos
try {
  await db.authenticate()
  db.sync() //crea la bd si no existe
  console.log('Conexión correcta a la base de datos')
} catch (error) {
  console.log(error)
}

//Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta Pública
app.use(express.static('public'))

//Routing y Middleware
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes) //aqui ya trae todas las rutas que use para usuarios
app.use('/', propiedadesRoutes) //aqui ya trae todas las rutas que use para
app.use('/api', apiRoutes)

//Deginir el puerto y arrancar el proyecto
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`)
})
