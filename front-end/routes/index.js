var express = require('express');
var router = express.Router();
const apiRequest = require(`../helpers/apiRequest`);

router.get(['/', '/login'], function (req, res, next) {
  const error = req.session.loginError || null;
  delete req.session.loginError;
  res.render('login', { error });
});

router.post('/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const isEmail = username.includes('@');

    const loginData = isEmail
      ? { email: username, password }
      : { username, password };

    const data = await apiRequest(req, 'POST', '/auth/login', loginData);

    if (data.role !== 1) {
      req.session.loginError = 'Only Admin allowed';
      return res.redirect('/login');
    }

    req.session.token = data.token;
    res.redirect('/admin/products');
  } catch (error) {
    req.session.loginError = error.message;
    res.redirect('/login');
  }
});

router.get('/logout', function (req, res, next) {
  delete req.session.token;
  res.redirect('/login');
});

module.exports = router;
