const formularioLogin = (req , res) =>{
    res.render('auth/login',{
        autenticado: false
    }) 
}

const formularioRegistro = (req , res) =>{
    res.render('auth/registro',{
        
    }) 
}

//varios export
//export default; //solo uno por archivo
export {
    formularioLogin,
    formularioRegistro
}
