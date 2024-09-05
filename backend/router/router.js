const express = require("express");
const router = express.Router();

const controladorProductos = require('../controller/producto.controller');


// INDEX
router.get('/index', async (req, res) => {
    const productos = await controladorProductos.verProductos()
    res.render('pages/index', {productos})
});


// PRODUCTOS
router.get('/productos', async (req, res) => {
    const productos = await controladorProductos.verProductos(req, res)
    res.render('pages/listarProductos', {productos})
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


module.exports = router