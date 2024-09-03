const exp = require("express");
const clienteModel = require('./backend/models/cliente.models');
const pedidoModel = require('./backend/models/pedido.models');
const mongoose = require('mongoose');
const logger = require("morgan");
require('dotenv').config();

const router = require('./backend/router/router');

const express = require('express');
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

const path = require('path')
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/frontend/views'));

app.use(express.static('./frontend/public'));


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