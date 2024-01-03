import express from 'express'; 
import { formularioLogin, formularioRegistro, formularioOlvidePassword } from '../controllers/usuarioController.js';

const router = express.Router();

//Routing
router.get('/login',formularioLogin);
router.get('/registro',formularioRegistro);
router.get('/olvide-Password',formularioOlvidePassword);

export default router;