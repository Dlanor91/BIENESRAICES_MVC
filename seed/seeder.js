import { exit } from 'node:process'
import categorias from './categorias.js'
import precios from './precios.js'
import usuarios from './usuarios.js'
import { Categoria, Precio, Usuario } from '../models/index.js'

import db from '../config/db.js'

const importarDatos = async () => {
  try {
    //Autenticar en la base de datos
    await db.authenticate()

    //Generar las columnas antes de insertarlas
    await db.sync()

    //Verificar si no tienen datos ya las tablas
    const countCategorias = await Categoria.count()
    const countPrecios = await Precio.count()
    const countUsuarios = await Usuario.count()

    //Insertar todos los datos, al ser mas de 1 se recomienda un promise si no dependen uno de otro, ambos inician al mismo tiempo
    if (countCategorias <= 0 && countPrecios <= 0 && countUsuarios <= 0) {
      await Promise.all([
        Categoria.bulkCreate(categorias),
        Precio.bulkCreate(precios),
        Usuario.bulkCreate(usuarios),
      ])

      console.log('Datos importados correctamente')
    } else {
      console.log('Ya los datos habian sido importados')
    }

    exit() //exit en 0 es que termina todo correctamente y sin errores
  } catch (error) {
    console.log(error)
    exit(1) //finaliza el proceso con errores
  }
}

const eliminarDatos = async () => {
  try {
    /*await Promise.all([
      Categoria.destroy({where: {}, truncate: true}),
      Precio.destroy({where: {}, truncate: true})
    ])//elimina los modelos*/
    await db.sync({ force: true }) //elimina todos los modelos de este seeder

    console.log('Datos eliminados correctamente')

    exit() //exit en 0 es que termina todo correctamente y sin errores
  } catch (error) {
    console.log(error)
    exit(1) //finaliza el proceso con errores
  }
}

//forma de pasar argumentos desde argv y la posicion 2 es del package json que tiene un -i de insertar, e de elimianr y asi los diferencio en los argumentos
if (process.argv[2] === '-i') {
  importarDatos()
}

if (process.argv[2] === '-e') {
  eliminarDatos()
}
