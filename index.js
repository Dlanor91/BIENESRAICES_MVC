//Inicia el server como tipo express
//const express = require("express"); con common js

import express from 'express'; //con ems module
import usuarioRoutes from './routes/usuarioRoutes.js' //Importo el routing
import db from './config/db.js';

//Crear la app
const app = express();

//Conexion a la base de datos
try {
  await db.authenticate();
  console.log('Conexión correcta a la base de datos')
} catch (error) {
  console.log(error)
}

//Routing y Middleware
app.use('/auth',usuarioRoutes); //aqui ya trae todas las rutas con use

//Habilitar Pug
app.set('view engine', 'pug');
app.set('views','./views')

//Carpeta Pública
app.use(express.static('public'))

//Deginir el puerto y arrancar el proyecto
const port = 3000;

app.listen(port, () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});
