var express = require('express');
var router = express.Router();
const apiRequest = require(`../helpers/apiRequest`);

router.get('/', async function (req, res, next) {
  const membershipError = req.session.membershipError || null;
  delete req.session.membershipError;
  try {
    const membershipsData = await apiRequest(req, 'GET', '/memberships');

    res.render('memberships', {
      memberships: membershipsData.memberships,
      error: membershipError,
    });
  } catch (error) {
    res.render('memberships', {
      memberships: [],
      error: error.message,
    });
  }
});

router.post('/update/:id', async function (req, res, next) {
  try {
    await apiRequest(req, 'PUT', `/memberships/${req.params.id}`, req.body);
  } catch (error) {
    req.session.membershipError = error.message;
  }
  res.redirect('/admin/memberships');
});

module.exports = router;
