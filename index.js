//Inicia el server como tipo express
//const express = require("express"); con common js

import express from 'express' //con ems module
import usuarioRoutes from './routes/usuarioRoutes.js' //Importo el routing
import db from './config/db.js'

//Crear la app
const app = express()

//Habilitar lectura de datos del formuluraio
app.use(express.urlencoded({ extended: true }))

//Conexion a la base de datos
try {
  await db.authenticate()
  db.sync() //crea la bd si no existe
  console.log('Conexión correcta a la base de datos')
} catch (error) {
  console.log(error)
}

//Routing y Middleware
app.use('/auth', usuarioRoutes) //aqui ya trae todas las rutas con use

//Habilitar Pug
app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta Pública
app.use(express.static('public'))

//Deginir el puerto y arrancar el proyecto
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`)
})
