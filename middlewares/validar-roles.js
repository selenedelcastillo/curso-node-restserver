const {response} = require('express');

const esAdminRole = (req, res = response, next) => {

    if(!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar role sin verificar token'
        })
    }

    const {rol, nombre} = req.usuario;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador, sin permiso!!!`
        })
    }

    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {
        
        if(!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar role sin verificar token'
            })
        }

        if(!roles.includes(req.usuario.rol)){
            res.status(400).json({
                msg: `Se debe de tener uno de los siguientes roles ${roles}`
            })
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}