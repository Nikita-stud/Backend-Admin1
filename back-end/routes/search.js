var express = require('express');
var router = express.Router();

const {
  successMessageProduct,
  errorMessageProduct,
} = require('../helpers/productsRespons');

const { errorMessage } = require('../helpers/generalResponse');

const hasRole = require('../middleware.js/hasRole');

var db = require('../models');
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);

router.post('/', hasRole, async function (req, res, next) {
  // #swagger.tags = ['Search']
  // #swagger.description = "Search for products by name, category or brand. Admins also see deleted products"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Search"
        }
  } */
  /* #swagger.responses[201] = { description: 'Products found' }
     #swagger.responses[400] = { description: 'Search criteria not provided' }
     #swagger.responses[404] = { description: 'No products found' }
    #swagger.responses[500] = { description: 'Internal server error' } */
  try {
    const role = req.user?.role;
    const { name, category, brand } = req.body;

    if (!name?.trim() && !category?.trim() && !brand?.trim()) {
      return errorMessage(
        res,
        400,
        'Provide at least one of: name, category or brand',
      );
    }

    const searchedProducts = await productService.search(
      role,
      name?.trim(),
      category?.trim(),
      brand?.trim(),
    );

    if (searchedProducts.length === 0) {
      return errorMessageProduct(res, 404, `No products found`);
    }

    return successMessageProduct(
      res,
      200,
      'Products found',
      searchedProducts,
      searchedProducts.length,
    );
  } catch (error) {
    return errorMessageProduct(
      res,
      500,
      `Something went wrong when searching for products:  ${error.message}`,
    );
  }
});

module.exports = router;
