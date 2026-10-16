var jwt = require('jsonwebtoken');
const { errorMessage } = require('../helpers/generalResponse');

function hasRole(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      return errorMessage(res, 401, 'Invalid or expired token');
    }
  }
  next();
}
module.exports = hasRole;
