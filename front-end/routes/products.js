var express = require('express');
var router = express.Router();
const apiRequest = require(`../helpers/apiRequest`);

router.get('/', async function (req, res, next) {
  const productError = req.session.productError || null;
  delete req.session.productError;
  try {
    const [productsData, categoriesData, brandsData] = await Promise.all([
      apiRequest(req, 'GET', '/products'),
      apiRequest(req, 'GET', '/categories'),
      apiRequest(req, 'GET', '/brands'),
    ]);

    res.render('products', {
      products: productsData.products,
      categories: categoriesData.categories,
      brands: brandsData.brands,
      error: productError,
    });
  } catch (error) {
    res.render('products', {
      products: [],
      categories: [],
      brands: [],
      error: error.message,
    });
  }
});

router.post('/search', async function (req, res, next) {
  let categories = [];
  let brands = [];

  try {
    const [categoriesData, brandsData] = await Promise.all([
      apiRequest(req, 'GET', '/categories'),
      apiRequest(req, 'GET', '/brands'),
    ]);

    categories = categoriesData.categories;
    brands = brandsData.brands;

    const productsData = await apiRequest(req, 'POST', '/search', req.body);
    res.render('products', {
      products: productsData.products,
      categories,
      brands,
      error: null,
    });
  } catch (error) {
    res.render('products', {
      products: [],
      categories,
      brands,
      error: error.message,
    });
  }
});

router.post('/add', async function (req, res, next) {
  try {
    await apiRequest(req, 'POST', '/products', req.body);
  } catch (error) {
    req.session.productError = error.message;
  }
  res.redirect('/admin/products');
});

router.post('/update/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'PUT', `/products/${req.params.id}`, {
      ...req.body,
      isdeleted: req.body.isdeleted === 'on',
    });
  } catch (error) {
    req.session.productError = error.message;
  }
  res.redirect('/admin/products');
});

router.post('/delete/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'DELETE', `/products/${req.params.id}`);
  } catch (error) {
    req.session.productError = error.message;
  }
  res.redirect('/admin/products');
});

module.exports = router;
