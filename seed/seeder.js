import { exit } from 'node:process'
import categorias from './categorias.js'
import Categoria from '../models/Categoria.js'

import db from '../config/db.js'

const importarDatos = async () => {
  try {
    //Autenticar en la base de datos
    await db.authenticate()

    //Generar las columnas antes de insertarlas
    await db.sync()

    //Insertar todos los datos
    await Categoria.bulkCreate(categorias)

    console.log('Datos importados correctamente')

    exit() //exit en 0 es que termina todo correctamente y sin errores
  } catch (error) {
    console.log(error)
    exit(1) //finaliza el proceso con errores
  }
}

//forma de pasar argumentos desde argv y la posicion 2 es del package json que tiene un -i
if (process.argv[2] === '-i') {
  importarDatos()
}
