const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');


const usuarioGet = async(req = request ,res = response) => {
    //const {q,nombre='Sin nombre',apikey,page=1,limit} = req.query;
    const {limite = 5, desde = 0} = req.query;
    const query = {estado:true}
    
    /*const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));
    
    const total = await Usuario.countDocuments(query);*/

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios
    })
}

const usuarioPut = async (req,res = response) => {
    const {id} = req.params;

    const {password, google, correo, ... resto} = req.body;

    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuarioPost = async (req,res = response) => {
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);

    //Guardar base de datos
    await usuario.save();

    res.json(usuario);
}

const usuarioDelete = async (req,res = response) => {
    const {id} = req.params;

    //Borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
}

module.exports = {
    usuarioGet,
    usuarioPut,
    usuarioPost,
    usuarioDelete
}