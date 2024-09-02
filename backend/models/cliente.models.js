const conexion = require('../config/connection');

const clienteSchema = new conexion.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre completo debe ser ignorado'],
        trim: true,
        maxlegth: [150, 'El nombre completo ingresado es muy extenso.'],
        minLength: [8, 'El nombre completo es muy corto.'],
    },
    telefono: {
        type: String,
        required: [true],
        trim: true,
        minLength: [9, 'El telefono ingresado es muy corto.'],
        maxlegth: [14, 'El telefono ingresado es muy extenso.'],
    },
    direccion: {
        type: String,
        required: true,
        trim: true,
        minLength: [9, 'La dirección ingresada es muy corta.'],
    },
    habilitado: {
        type: Boolean,
        default: true,
    },
    usuario: {
        type: conexion.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    }
}, { versionKey: false });

const clienteModel = conexion.model('Cliente', clienteSchema);

module.exports = clienteModel;
