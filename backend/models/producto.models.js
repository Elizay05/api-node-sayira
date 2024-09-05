const conexion = require('../config/connection');

const productoSchema = new conexion.Schema({
    referencia: {
        type: String,
        required: [true, 'La referencia es obligatoria']
    },
    nombre: {
        type: String,
        required: [true, 'Asignar un nombre es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria']
    },
    precio: {
        type: Number,
        default: [0, 'El precio por defecto es cero'],
        min: [0, 'El precio mínimo es cero']
    },
    stock: {
        type: Number,
        default: [0, 'El stock por defecto es cero'],
        min: [0, 'El stock por defecto es cero']
    },
    categoria: {
        type: conexion.SchemaTypes.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoria es obligatoria']
    },
    imagen: {
        type: String,
        required: [true, 'no existe la imagen o ruta']
    },
    habilitado: {
        type: Boolean,
        default: true
    }
},{ versionKey: false });

const productoModel = conexion.model('Producto', productoSchema);

module.exports = productoModel;