var jwt = require('jsonwebtoken');
const { errorMessage } = require('../helpers/generalResponse');

function isAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return errorMessage(res, 401, 'No token provided');
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = decoded;
  } catch (error) {
    return errorMessage(res, 401, 'Invalid or expired token');
  }
  next();
}

module.exports = isAuth;
