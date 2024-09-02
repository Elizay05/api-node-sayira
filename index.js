const exp = require("express");
const usuarioModel = require('./backend/models/user.models');
const clienteModel = require('./backend/models/cliente.models');
const categoriaModel = require('./backend/models/categoria.model');
const pedidoModel = require('./backend/models/pedido.models');
const mongoose = require('mongoose');
const logger = require("morgan");
require('dotenv').config();

const router = require('./backend/router/router');

const app = exp();

app.use(logger("dev"));
app.use(exp.json());
app.use(exp.urlencoded({ extended: false }));

app.use('/api', router);

const emailService = require('./backend/utils/email.service');


const path = require('path')
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/frontend/views'));

app.get('/', async (req, res) => {
    const consulta = await usuarioModel.find({});

    res.render('pages/index', {
        usuarios: consulta,

    });
})

app.get("/usuarios", async (req, res) => {
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
});

app.get("/usuarios/:id", async (req, res) => {
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
});

app.post("/usuarios", async (req, res) => {
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
});


app.put("/usuarios/:id", async (req, res) => {
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
});

app.delete("/usuarios/:id", async (req, res) => {
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
});

// Rutas para el modelo cliente
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await clienteModel.find({});
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/clientes/:correo', async (req, res) => {
    try {
        const cliente = await clienteModel.findOne({ correo: req.params.correo });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/clientes', async (req, res) => {
    try {
        const nuevoCliente = new clienteModel(req.body);
        const cliente = await nuevoCliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/clientes/:correo', async (req, res) => {
    try {
        const cliente = await clienteModel.findOneAndUpdate(
            { correo: req.params.correo },
            req.body,
            { new: true }  // Devuelve el documento modificado en lugar del original
        );
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/clientes/:correo', async (req, res) => {
    try {
        const cliente = await clienteModel.findOneAndDelete({ correo: req.params.correo });
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: 'Cliente no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




// Rutas para categorias

app.get('/categorias', async (req, res) => {
    try {
        const categorias = await categoriaModel.find();

        if (categorias) {
            return res.status(200).json(categorias);
        } else {
            return res.status(404).json({ message: "No hay categorias registradas" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al obtener las categorias", error: error.message });
    }
})


app.get("/categorias/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const categoria = await categoriaModel.findById(id);

        if (categoria) {
            return res.status(200).json(categoria);
        } else {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al buscar la categoria", error: error.message });
    }
});


app.post('/categorias', async (req, res) => {
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
});



app.put("/categorias/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, image } = req.body;

        const categoriaExistente = await categoriaModel.findOne({ nombre: nombre });
        if (categoriaExistente) {
            return res.status(400).json({ message: "La categoria ya está registrada" });
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
});


app.delete("/categorias/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const eliminacion = await categoriaModel.findByIdAndDelete(id);

        if (eliminacion) {
            return res.status(200).json({ message: "Categoria eliminada exitosamente", categoria: eliminacion });
        } else {
            return res.status(404).json({ message: "Categoria no encontrada" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocurrió un error al eliminar la categoria", error: error.message });
    }
});


// Rutas para el modelo pedido
app.get('/pedidos', async (req, res) => {
    try {
        const pedidos = await pedidoModel.find({}).populate('cliente').populate('carrito.producto');
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/pedidos/:cliente', async (req, res) => {
    try {
        // Busca el pedido por el nombre del cliente
        const pedidos = await pedidoModel.find({ cliente: req.params.cliente });

        // Verifica si se encontraron pedidos
        if (pedidos.length > 0) {
            res.status(200).json(pedidos);
        } else {
            res.status(404).json({ message: 'Pedido no encontrado para el cliente especificado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/pedidos', async (req, res) => {
    try {
        const nuevoPedido = new pedidoModel(req.body);
        const pedido = await nuevoPedido.save();
        res.status(201).json({
            message: 'Pedido creado exitosamente',pedido});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.put('/pedidos/:cliente', async (req, res) => {
    try {
        const pedido = await pedidoModel.findOneAndUpdate(
            { cliente: req.params.cliente },req.body,
            { new: true }
        );

        if (pedido) {
            res.status(200).json({ message: 'Pedido actualizado correctamente', pedido });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



app.delete('/pedidos/:cliente', async (req, res) => {
    try {
        const pedido = await pedidoModel.findOneAndDelete({ cliente: req.params.cliente });

        if (pedido) {
            res.status(200).json({ message: 'Pedido eliminado correctamente', pedido });
        } else {
            res.status(404).json({ message: 'Pedido no encontrado para el cliente especificado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/enviarcorreo', async (req, res) => {
    await emailService.sendEmail(
        "sayiis2005@gmail.com",
        "Confirmación de Registro",
        "Bienvenido a la tienda en línea más top de todo el mundo",
    );  
})


app.post('/registrocompleto', async (req, res) => {
    try {
        const usuario = {
            correo: "correo.academico.laboral@gmail.com",
            pass: "123456",
            rol: "cliente",
            habilitado: true,
        };
        let consulta = await modeloUsuario.create(usuario);
        if (consulta) {
            console.log(consulta._id)
            const cliente = {
                nombre: "Carmelo Alzate",
                correo: "correo.academico.laboral@gmail.com",
                direccion: "CRR 23 D SUR # 80 - 20",
                saldo: "126000",
                fechaRegistro: Date.now(),
                usuario: consulta._id
            }
            res.status(200).json("Usuario creado");
        }
        else {
            res.status(404).json("No se pudo crear el usuario");
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(process.env.PORT)