const usuarioModel = require('../models/usuario.models');

const emailService = require('../utils/email.service');


exports.verUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioModel.find();

        if (usuarios) {
            return res.status(200).json(usuarios);
        } else {
            return res.status(404).json({ message: "No hay usuarios registrados" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al obtener los usuarios", error: error.message });
    }
}

exports.verUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await usuarioModel.findById(id);

        if (usuario) {
            return res.status(200).json(usuario);
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al buscar el usuario", error: error.message });
    }
}

exports.crearUsuario = async (req, res) => {
    try {
        const usuarioExistente = await usuarioModel.findOne({ correo: req.body.correo });
        if (usuarioExistente) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const nuevo = {
            correo: req.body.correo,
            pass: req.body.pass,
            rol: req.body.rol,
            habilitado: true,
        };

        let consulta = await usuarioModel.create(nuevo);
        if (consulta) {
            await emailService.sendEmail(
                "sayiis2005@gmail.com",
                "Usuario Creado",
                "Usuario creado exitosamente",
            );
            res.status(200).json(consulta);
        } else {
            res.status(404).json({message: "No se pudo crear el usuario"});
        }
    } catch (error) {
        res.status(500).json({ message: "Ocurrió un error al crear el usuario", error: error.message });
    }
}


exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { correo, password, rol } = req.body;

        const correoExistente = await usuarioModel.findOne({ correo, _id: { $ne: id } });
        if (correoExistente) {
            return res.status(400).json({ message: "El correo ya está en uso por otro usuario" });
        }

        const usuarioEditado = {
            correo: correo,
            password: password,
            rol: rol,
            habilitado: true,
        };

        const actualizado = await usuarioModel.findByIdAndUpdate(id, usuarioEditado, { new: true });

        if (actualizado) {
            res.json(actualizado);
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
    }
}

exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const eliminacion = await usuarioModel.findByIdAndDelete(id);

        if (eliminacion) {
            return res.status(200).json({ message: "Usuario eliminado exitosamente", usuario: eliminacion });
        } else {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al eliminar el usuario", error: error.message });
    }
}

