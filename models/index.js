import Categoria from './Categoria.js'
import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Usuario from './Usuario.js'

/*Precio.hasOne(Propiedad) */ //La propiedad tiene un precio
Propiedad.belongsTo(Precio, { foreignKey: 'precioId' }) //la propiedad tiene un precio, se puede relacionar por foreignKey por las dudas
/*Propiedad.belongsTo(Precio, {foreignKey:'precioId'}) */ //si quiero ponr un foreingKey presonalizado

Propiedad.belongsTo(Categoria, { foreignKey: 'categoriaId' }) //la propiedad tiene una categoria
Propiedad.belongsTo(Usuario, { foreignKey: 'usuarioId' }) //la propiedad tiene un precio
export { Propiedad, Categoria, Precio, Usuario }
