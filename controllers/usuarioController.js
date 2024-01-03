const formularioLogin = (req , res) =>{
    res.render('auth/login',{
        pagina: 'Iniciar Sesión'
    }) 
}

const formularioRegistro = (req , res) =>{
    res.render('auth/registro',{
        pagina: 'Crear Cuenta'
    }) 
}

const formularioOlvidePassword = (req , res) =>{
    res.render('auth/olvide-password',{
        pagina: 'Recupera tu acceso a bienes raices'
    }) 
}

//varios export
//export default; //solo uno por archivo
export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword
}
