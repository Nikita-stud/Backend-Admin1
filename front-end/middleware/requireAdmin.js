module.exports = function requireAdmin(req, res, next) {
  if (!req.session.token) {
    return res.redirect('/');
  }
  next();
};
