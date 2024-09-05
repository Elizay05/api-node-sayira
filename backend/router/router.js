const express = require("express");
const router = express.Router();

const controladorProductos = require('../controller/producto.controller');
const controladorCategorias = require('../controller/categoria.controller');
const controladorUsuarios = require('../controller/usuario.controller')


// INDEX
router.get('/index', async (req, res) => {
    const productos = await controladorProductos.verProductos()
    res.render('pages/index', {productos})
});


// CATEGORIAS
router.get('/categorias', controladorCategorias.verCategorias);
router.get('/categorias/:id', controladorCategorias.verCategoria);
router.post('/categorias', controladorCategorias.crearCategoria);
router.put('/categorias/:id', controladorCategorias.actualizarCategoria);
router.delete('/categorias/:id', controladorCategorias.eliminarCategoria);


// PRODUCTOS
router.get('/productos', async (req, res) => {
    const productos = await controladorProductos.verProductos(req, res)
    const categorias = await controladorCategorias.verCategorias(req, res)
    res.render('pages/listarProductos', {productos, categorias})
});


router.post('/productos', async (req, res) => {
    controladorProductos.crearProducto(req, res, '/api/productos');
});

router.post('/productos/:id', async (req, res) => {
    controladorProductos.actualizarProducto(req, res, '/api/productos');
});

router.delete('/productos/:id', async (req, res) => {
    controladorProductos.eliminarProducto(req, res, '/api/productos');
});

// USUARIOS
router.get('/usuarios', controladorUsuarios.verUsuarios);
router.get('/usuarios/:id', controladorUsuarios.verUsuario);
router.post('/usuarios', controladorUsuarios.crearUsuario);
router.put('/usuarios/:id', controladorUsuarios.actualizarUsuario);
router.delete('/usuarios/:id', controladorUsuarios.eliminarUsuario);


module.exports = router