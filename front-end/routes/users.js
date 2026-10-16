var express = require('express');
var router = express.Router();
const apiRequest = require(`../helpers/apiRequest`);

router.get('/', async function (req, res, next) {
  const userError = req.session.userError || null;
  delete req.session.userError;
  try {
    const [usersData, membershipsData] = await Promise.all([
      apiRequest(req, 'GET', '/auth/users'),
      apiRequest(req, 'GET', '/memberships'),
    ]);
    res.render('users', {
      users: usersData.users,
      memberships: membershipsData.memberships,
      error: userError,
    });
  } catch (error) {
    res.render('users', { users: [], memberships: [], error: error.message });
  }
});

router.post('/update/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'PUT', `/auth/users/${req.params.id}`, req.body);
    res.redirect('/admin/users');
  } catch (error) {
    req.session.userError = error.message;
    res.redirect('/admin/users');
  }
});

router.post('/delete/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'DELETE', `/auth/users/${req.params.id}`);
  } catch (error) {
    req.session.userError = error.message;
  }
  res.redirect('/admin/users');
});

module.exports = router;
