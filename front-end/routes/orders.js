var express = require('express');
var router = express.Router();
const apiRequest = require(`../helpers/apiRequest`);

router.get('/', async function (req, res, next) {
  const orderError = req.session.orderError || null;
  delete req.session.orderError;
  try {
    const ordersData = await apiRequest(req, 'GET', '/orders');

    res.render('orders', {
      orders: ordersData.orders,
      error: orderError,
    });
  } catch (error) {
    res.render('orders', {
      orders: [],
      error: error.message,
    });
  }
});

router.post('/update/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'PUT', `/orders/${req.params.id}`, req.body);
  } catch (error) {
    req.session.orderError = error.message;
  }
  res.redirect('/admin/orders');
});

module.exports = router;
