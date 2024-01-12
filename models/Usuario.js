import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import bcrypt from 'bcrypt'

const Usuario = db.define('usuarios', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  token: DataTypes.STRING,
  confirmado: DataTypes.BOOLEAN,
},{
  hooks: {
    beforeCreate: async function(usuario){
      const salt = await bcrypt.benSalt(10) //rondas de hash
        
    }
  }
})

export default Usuario
