var express = require('express');
var router = express.Router();
const apiRequest = require(`../helpers/apiRequest`);

router.get('/', async function (req, res, next) {
  const brandError = req.session.brandError || null;
  delete req.session.brandError;
  try {
    const brandsData = await apiRequest(req, 'GET', '/brands');

    res.render('brands', {
      brands: brandsData.brands,
      error: brandError,
    });
  } catch (error) {
    res.render('brands', {
      brands: [],
      error: error.message,
    });
  }
});

router.post('/add', async function (req, res, next) {
  try {
    await apiRequest(req, 'POST', '/brands', req.body);
  } catch (error) {
    req.session.brandError = error.message;
  }
  res.redirect('/admin/brands');
});

router.post('/update/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'PUT', `/brands/${req.params.id}`, req.body);
  } catch (error) {
    req.session.brandError = error.message;
  }
  res.redirect('/admin/brands');
});

router.post('/delete/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'DELETE', `/brands/${req.params.id}`);
  } catch (error) {
    req.session.brandError = error.message;
  }
  res.redirect('/admin/brands');
});

module.exports = router;
