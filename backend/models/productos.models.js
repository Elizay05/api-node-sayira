const conexion = require('../config/connection');

const productoSchema = new conexion.Schema({
    id: {
        type: Number,
        required: [true, 'El ID es obligatorio']
    },
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
        id: {
            type: Number,
            required: [true, 'El ID de la categoría es obligatorio']
        },
        name: {
            type: String,
            required: [true, 'El nombre de la categoría es obligatorio']
        },
        image: {
            type: String,
            required: [true, 'La imagen de la categoría es obligatoria']
        }
    },
    images: [
        {
            type: String,
            required: [true, 'Las imágenes son obligatorias']
        }
    ],
});

const productoModel = conexion.model('productos', productoSchema);

module.exports = productoModel;
