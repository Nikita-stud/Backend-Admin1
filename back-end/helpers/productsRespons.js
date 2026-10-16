const successMessageProduct = (
  res,
  statuscode,
  result,
  products,
  productsCounts,
) =>
  res.status(statuscode).json({
    status: 'success',
    statuscode,
    data: { result, productsCounts, products },
  });

const errorMessageProduct = (res, statuscode, result) =>
  res
    .status(statuscode)
    .json({ status: 'error', statuscode, data: { result, products: [] } });

module.exports = { successMessageProduct, errorMessageProduct };
