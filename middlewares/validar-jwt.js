const { response, request } = require('express');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
 

const validarJWT = async(req = request, res = response, next ) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No se mandó el token'
        })
    }

    try{
        const {uid} = jwt.verify(token, process.env.SECRETKEY);

        const usuario = await Usuario.findById(uid);

        if(!usuario) {
            return res.status(401).json({
                msg: 'Token no válido, usuario no registrado'
            })
        }

        if(!usuario.estado){
            return  res.status(401).json({
                msg: 'Token no válido, usuario dado de baja'
            })
        }
        
        req.usuario = usuario;

        next();
    }
    catch(error){
        console.log(error);

        return res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}