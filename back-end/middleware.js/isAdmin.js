const { errorMessage } = require('../helpers/generalResponse');

function isAdmin(req, res, next) {
  if (req.user?.role !== 1) {
    return errorMessage(res, 403, 'Only Admin allowed');
  }

  next();
}
module.exports = isAdmin;
