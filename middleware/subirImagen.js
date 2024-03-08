import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/tokens.js'
import { header } from 'express-validator'

const storage = multer.diskStorage({
    destination: function(req, archivo, cb){
        cb(null, './public/uploads/') //cb es callback por si funciona todo bien se accede a el 
    },
    filename: function(req, file, cb){
        cb(null, generarId() + path.extname(file.originalname) ) //aqui el segundo aporametro es el nombredel archivo. el path.extname trae el nombre y la extensio
    }
})

const upload = multer({ storage })

export default upload