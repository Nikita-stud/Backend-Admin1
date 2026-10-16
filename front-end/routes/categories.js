var express = require('express');
var router = express.Router();
const apiRequest = require(`../helpers/apiRequest`);

router.get('/', async function (req, res, next) {
  const categoryError = req.session.categoryError || null;
  delete req.session.categoryError;
  try {
    const categoriesData = await apiRequest(req, 'GET', '/categories');

    res.render('categories', {
      categories: categoriesData.categories,
      error: categoryError,
    });
  } catch (error) {
    res.render('categories', {
      categories: [],
      error: error.message,
    });
  }
});

router.post('/add', async function (req, res, next) {
  try {
    await apiRequest(req, 'POST', '/categories', req.body);
  } catch (error) {
    req.session.categoryError = error.message;
  }
  res.redirect('/admin/categories');
});

router.post('/update/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'PUT', `/categories/${req.params.id}`, req.body);
  } catch (error) {
    req.session.categoryError = error.message;
  }
  res.redirect('/admin/categories');
});

router.post('/delete/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'DELETE', `/categories/${req.params.id}`);
  } catch (error) {
    req.session.categoryError = error.message;
  }
  res.redirect('/admin/categories');
});

module.exports = router;
