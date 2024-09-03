const productoModel = require('../models/producto.models');

exports.verProductos = async(req, res) => {
    try {
        const productos = await productoModel.find().populate('category');
        if (productos) {
            return res.render('pages/listarProductos', { productos });
        } else {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Ocurrió un error al obtener los productos', error: error.message });
    }
}


exports.verProducto = async (req, res) => {
    try {

        const producto = await productoModel.findById(req.params.id).populate('category');

        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error al obtener el producto:", error: error.message });
    }
}


exports.crearProducto = async (req, res) => {
    try {

        const productoExistente = await productoModel.findOne({ title: req.body.nombre });
        if (productoExistente) {
            return res.status(400).json({ message: "El producto ya está registrado" });
        }

        const nuevo = {
            title: req.body.nombre,
            description: req.body.descripcion,
            price: req.body.precio,
            category: req.body.categoria,
            images: req.body.imagenes
        };

        let productoNuevo = await productoModel.create(nuevo);
        if (productoNuevo) {
            res.status(200).json(productoNuevo);
        } else {
            res.status(404).json({ message: 'No se pudo registrar el producto' });
        }
    } catch (error) {
        res.status(400).json({ message: "Ocurrio un error al registrar el producto:", error: error.message });
    }
}


exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const { nombre, descripcion, precio, categoria, images } = req.body;

        const productoActual = await productoModel.findById(id);
        if (!productoActual) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const productoExistente = await productoModel.findOne({ title: nombre });
        if (productoExistente && productoExistente._id.toString() !== id) {
            return res.status(400).json({ message: "Este producto ya está registrado" });
        }
        
        const productoEditado = {
            title: nombre,
            description: descripcion,
            price: precio,
            category: categoria,
            images: images
        };

        const actualizado = await productoModel.findByIdAndUpdate(id, productoEditado, { new: true });

        if (actualizado) {
            res.json(actualizado);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(400).json({ message: "Ocurrio un error al actualizar el producto:", error: error.message });
    }
}


exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await productoModel.findByIdAndDelete(id);
        
        if (producto) {
            res.status(200).json({ message: 'Producto eliminado correctamente', producto });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: "Ocurrio un error al eliminar el producto:", error: error.message });
    }
}