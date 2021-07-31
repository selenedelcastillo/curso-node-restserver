const { Router} = require('express' );
const { check} = require('express-validator' );
const { usuarioGet, usuarioPut, usuarioPost, usuarioDelete } = require('../controllers/usuarios');
const { esRoleValido, emailExiste, idUsuarioExiste, idUsuarioBorrado } = require('../helpers/db-validators');
/*const { validarCampos } = require('../middlewares/validar-campos' );
const { validarJWT }  = require('../middlewares/validar-jwt');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');*/

const { validarCampos, validarJWT, tieneRole, esAdminRole } = require('../middlewares');

const router = Router(); 

router.get('/', usuarioGet);

router.put('/:id', [
    check('id','El id no es válido').isMongoId(),
    check('id').custom(idUsuarioExiste),
    check('rol').custom(esRoleValido),
    validarCampos
], usuarioPut);

router.post('/',[ 
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','El password debe ser mínimo de 6 letras').isLength({min: 6}),
    check('correo','El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    //check('rol','No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido), //(rol) => esRoleValido(rol) como es el mismo argumento no se necesita especificar
    validarCampos
],usuarioPost);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id','El id no es válido').isMongoId(),
    check('id').custom(idUsuarioExiste),
    check('id').custom(idUsuarioBorrado),
    validarCampos
]
,usuarioDelete);

module.exports = router