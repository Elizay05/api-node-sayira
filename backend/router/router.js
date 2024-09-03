const express = require("express");
const router = express.Router();

const controladorProductos = require('../controller/producto.controller');
const controladorCategorias = require('../controller/categoria.controller');
const controladorUsuarios = require('../controller/usuario.controller')
const controladorIndex = require('../controller/index.controller')

// INDEX
router.get('/', controladorIndex.index);

// CATEGORIAS
router.get('/categorias', controladorCategorias.verCategorias);
router.get('/categorias/:id', controladorCategorias.verCategoria);
router.post('/categorias', controladorCategorias.crearCategoria);
router.put('/categorias/:id', controladorCategorias.actualizarCategoria);
router.delete('/categorias/:id', controladorCategorias.eliminarCategoria);


// PRODUCTOS
router.get('/productos', controladorProductos.verProductos);
router.get('/productos/:id', controladorProductos.verProducto);
router.post('/productos', controladorProductos.crearProducto);
router.put('/productos/:id', controladorProductos.actualizarProducto);
router.delete('/productos/:id', controladorProductos.eliminarProducto);

// USUARIOS
router.get('/usuarios', controladorUsuarios.verUsuarios);
router.get('/usuarios/:id', controladorUsuarios.verUsuario);
router.post('/usuarios', controladorUsuarios.crearUsuario);
router.put('/usuarios/:id', controladorUsuarios.actualizarUsuario);
router.delete('/usuarios/:id', controladorUsuarios.eliminarUsuario);


module.exports = router