const conexion = require('../config/connection');

const clienteSchema = new conexion.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        unique: [true, 'El email ya existe'],
        required: [true, 'El email es obligatorio']
    },
    usuario: {
        type: conexion.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es obligatoria'],
        minLength: [5, 'La dirección debe tener más de 5 caracteres']
    },
    saldo: {
        type: Number,
        default: 0,
        required: [true, 'El saldo es obligatorio']
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const clienteModel = conexion.model('clientes', clienteSchema);

module.exports = clienteModel;
