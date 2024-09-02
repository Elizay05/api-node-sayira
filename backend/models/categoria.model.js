const conexion = require('../config/connection')

const categoriaSchema = new conexion.Schema({
    nombre:{
        type: String,
        unique: true,
        required: true
    },
    descripcion:{
        type: String,
        required: true,
        minLength: [5, 'La descripción debe tener más de 5 caracteres'],
        maxLength: [300, 'La contraseña debe ser de menos de 300 caracteres']

    },
    image:{
        type: String
    }
}, { versionKey: false });

const categoriaModel = conexion.model('Categoria', categoriaSchema);

module.exports = categoriaModel;