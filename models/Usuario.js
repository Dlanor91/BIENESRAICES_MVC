import { DataTypes } from 'sequelize'
import db from '../config/db.js'
import bcrypt from 'bcrypt'

const Usuario = db.define(
  'usuarios',
  {
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
  },
  {
    hooks: {
      beforeCreate: async function (usuario) {
        const salt = await bcrypt.genSalt(10) //rondas de hash
        usuario.password = await bcrypt.hash(usuario.password, salt)
      },
    },
    scopes: {
      //sirven para elimianr campos en modelos especificos
      eliminarPassword: {
        attributes: {
          exclude: [
            'password',
            'token',
            'confirmado',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    },
  },
)

//Metodos personalizados
Usuario.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

export default Usuario
