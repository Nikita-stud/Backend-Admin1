const successMessage = (res, statuscode, data) =>
  res.status(statuscode).json({ status: 'success', statuscode, data });

const errorMessage = (res, statuscode, result) =>
  res
    .status(statuscode)
    .json({ status: 'error', statuscode, data: { result } });

module.exports = { successMessage, errorMessage };
