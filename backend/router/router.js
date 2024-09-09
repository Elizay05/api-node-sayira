stripe = require("stripe")(process.env.STRIPEKEY);
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

const calculateOrderAmount = (items) => {
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    let total = 0;
    items.forEach((item) => {
      total += (item.precio * item.cantidad);
    });
    return total;
  };
  
  router.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
      // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  });

router.get('/checkout', async (req, res) => {
    res.render('pages/checkout')
  });

module.exports = router