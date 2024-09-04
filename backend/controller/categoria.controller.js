const categoriaModel = require('../models/categoria.models');


exports.verCategorias = async (req, res) => {
    try {
        const categorias = await categoriaModel.find();

        if (categorias) {
            return categorias;
        } else {
            return res.status(404).json({ message: "No hay categorias registradas" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al obtener las categorias", error: error.message });
    }
}


exports.verCategoria = async (req, res) => {
    try {
        const categoria = await categoriaModel.findById(req.params.id);

        if (categoria) {
            return res.status(200).json(categoria);
        } else {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al obtener la categoria", error: error.message });
    }
}


exports.crearCategoria = async (req, res) => {
    try {

        const categoriaExistente = await categoriaModel.findOne({ nombre: req.body.nombre });
        if (categoriaExistente) {
            return res.status(400).json({ message: "La categoria ya está registrada" });
        }

        const nuevo = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            image: req.body.image
        };

        let categoriaNueva = await categoriaModel.create(nuevo);
        if (categoriaNueva) {
            res.status(200).json(categoriaNueva);
        } else {
            res.status(404).json({ message: 'No se pudo registrar la categoria' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Ocurrio un error al registrar la categoria: ' + error.message });
    }
}



exports.actualizarCategoria = async (req, res) => {
    try {

        const { id } = req.params

        const { nombre, descripcion, image } = req.body;

        const categoriaActual = await categoriaModel.findById(id);
        if (!categoriaActual) {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }

        const categoriaExistente = await categoriaModel.findOne({ nombre: nombre });
        if (categoriaExistente && categoriaExistente._id.toString() !== id) {
            return res.status(400).json({ message: "Esta categoria ya está registrada" });
        }

        const categoriaEditada = {
            nombre: nombre,
            descripcion: descripcion,
            image: image,
        };

        const actualizado = await categoriaModel.findByIdAndUpdate(id, categoriaEditada, { new: true });

        if (actualizado) {
            res.json(actualizado);
        } else {
            res.status(404).json({ message: "Categoria no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la categoria", error: error.message });
    }
}


exports.eliminarCategoria = async (req, res) => {
    try {
        const eliminacion = await categoriaModel.findByIdAndDelete(req.params.id);

        if (eliminacion) {
            return res.status(200).json({ message: "Categoria eliminada exitosamente", categoria: eliminacion });
        } else {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al eliminar la categoria", error: error.message });
    }
}