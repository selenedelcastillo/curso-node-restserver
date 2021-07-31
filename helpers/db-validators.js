const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (rol='') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no existe en la BD`);
    }
}

const emailExiste = async (correo='') => {
    const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
        throw new Error('El correo ya existe')
    }
}

const idUsuarioExiste = async (id='') => {
    const existeId = await Usuario.findById(id);

    if(!existeId){
        throw new Error('El id no existe')
    }
}

const idUsuarioBorrado = async (id='') => {
    const {estado} = await Usuario.findById(id);

    if(!estado){
        throw new Error('El id esta dado de baja')
    }
}

module.exports ={ 
    esRoleValido,
    emailExiste,
    idUsuarioExiste,
    idUsuarioBorrado
}