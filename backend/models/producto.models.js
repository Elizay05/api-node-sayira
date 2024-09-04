const conexion = require('../config/connection');

const productoSchema = new conexion.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    category: {
        type: conexion.SchemaTypes.ObjectId,
        ref: 'Categoria',
        required: [true, 'La categoria es obligatoria']
    },
    images: [
        {
            type: String,
            required: [true, 'Las imágenes son obligatorias']
        }
    ],
}, { versionKey: false });

const productoModel = conexion.model('Producto', productoSchema);

module.exports = productoModel;