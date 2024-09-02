const express = require("express");
const router = express.Router();

const controladorProductos = require('../controller/producto.controller');
const controladorCategorias = require('../controller/categoria.controller');

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

module.exports = router