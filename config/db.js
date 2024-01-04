import  Sequelize  from 'sequelize';

const db = new Sequelize('bienesraices_mvc','root','12345678',{
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    defined:{
        timestamps: true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db;