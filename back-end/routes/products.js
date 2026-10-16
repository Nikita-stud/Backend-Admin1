var express = require('express');
var router = express.Router();

const isAuth = require('../middleware.js/isAuth');
const isAdmin = require('../middleware.js/isAdmin');
const hasRole = require('../middleware.js/hasRole');

const {
  successMessageProduct,
  errorMessageProduct,
} = require('../helpers/productsRespons');

const { successMessage, errorMessage } = require('../helpers/generalResponse');

var db = require('../models');
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);

router.get('/', hasRole, async function (req, res, next) {
  // #swagger.tags = ['Products']
  // #swagger.description = "Get all products (Requires authentication)"
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Product found' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[404] = { description: 'Products not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const role = req.user?.role;
    const products = await productService.getAll(role);

    if (!products || products.length === 0) {
      return errorMessageProduct(res, 404, 'No products found');
    }

    return successMessageProduct(res, 200, 'Products found', products);
  } catch (error) {
    return errorMessageProduct(
      res,
      500,
      `Something went wrong when fetching the product:  ${error.message}`,
    );
  }
});

router.get('/:id', hasRole, async function (req, res, next) {
  // #swagger.tags = ['Products']
  // #swagger.parameters['id'] = { description: 'Product id', type: 'integer' }
  // #swagger.description = "Get a specific product by id (Requires authentication)"
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Product found' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[404] = { description: 'Product not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }

  try {
    const role = req.user?.role;
    const product = await productService.getSingleProduct(id, role);

    if (!product || product.length === 0) {
      return errorMessageProduct(
        res,
        404,
        `No product with id ${id} not found`,
      );
    }

    return successMessageProduct(res, 200, 'Product found', product);
  } catch (error) {
    return errorMessageProduct(
      res,
      500,
      `Something went wrong when fetching the product with id ${id}:  ${error.message}`,
    );
  }
});

router.post('/', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Products']
  // #swagger.description = "Create a new product (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Products"
        }
  } */
  /* #swagger.responses[201] = { description: 'Product created' }
     #swagger.responses[400] = { description: 'Missing/invalid name or product already exists' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
    #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const { name, description, unitprice, imgurl, quantity, brand, category } =
      req.body;

    if (!name?.trim() || !description?.trim()) {
      return errorMessage(res, 400, 'Name and description are required');
    }

    if (
      !unitprice ||
      quantity == null ||
      quantity === '' ||
      isNaN(Number(unitprice)) ||
      isNaN(Number(quantity))
    ) {
      return errorMessage(
        res,
        400,
        'Unitprice and quantity must be a number and greater than 0',
      );
    }
    if (Number(unitprice) <= 0) {
      return errorMessage(res, 400, 'Unitprice must be greater than 0');
    }
    if (Number(quantity) < 0) {
      return errorMessage(res, 400, 'Quantity cannot be negative');
    }
    if (!imgurl?.trim()) {
      return errorMessage(res, 400, 'Imageurl is required');
    }

    if (!brand?.trim() || !category?.trim()) {
      return errorMessage(res, 400, 'Brand or category are required');
    }

    const created = await productService.createNew(
      name,
      description,
      unitprice,
      quantity,
      imgurl,
      brand,
      category,
    );

    const product = {
      name: created.name,
      id: created.id,
      description: created.description,
      unitprice: created.unitprice,
      date_added: created.date_added,
      imgurl: created.imgurl,
      quantity: created.quantity,
      isdeleted: created.isdeleted ? 1 : 0,
      createdAt: created.createdAt,
      BrandId: created.brand_id,
      CategoryId: created.category_id,
      brand,
      category,
    };

    return successMessageProduct(res, 201, 'Product created', product);
  } catch (error) {
    return errorMessageProduct(
      res,
      500,
      `Something went wrong when creating the product:  ${error.message}`,
    );
  }
});

router.put('/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Products']
  // #swagger.parameters['id'] = { description: 'Product id', type: 'integer' }
  // #swagger.description = "Update an existing product (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Products"
        }
  } */
  /* #swagger.responses[200] = { description: 'Product updated' }
     #swagger.responses[400] = { description: 'Missing/invalid data or product already exists' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
    #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }
  try {
    const {
      name,
      description,
      unitprice,
      imgurl,
      quantity,
      brand,
      category,
      isdeleted,
    } = req.body;

    if (!name?.trim() || !description?.trim()) {
      return errorMessage(res, 400, 'Name and description are required');
    }

    if (
      !unitprice ||
      quantity == null ||
      quantity === '' ||
      isNaN(Number(unitprice)) ||
      isNaN(Number(quantity))
    ) {
      return errorMessage(
        res,
        400,
        'Unitprice and quantity must be a number and greater than 0',
      );
    }
    if (Number(unitprice) <= 0) {
      return errorMessage(res, 400, 'Unitprice must be greater than 0');
    }
    if (Number(quantity) < 0) {
      return errorMessage(res, 400, 'Quantity cannot be negative');
    }
    if (!imgurl?.trim()) {
      return errorMessage(res, 400, 'Imageurl is required');
    }

    if (!brand?.trim() || !category?.trim()) {
      return errorMessage(res, 400, 'Brand or category are required');
    }

    if (isdeleted !== undefined && typeof isdeleted !== 'boolean') {
      return errorMessage(res, 400, 'Isdeleted must be true or false');
    }

    const update = await productService.update(
      id,
      name,
      description,
      unitprice,
      quantity,
      imgurl,
      brand,
      category,
      isdeleted,
    );

    if (!update) {
      return errorMessage(res, 404, `Product with id ${id} not found`);
    }

    const product = {
      name: update.name,
      id: update.id,
      description: update.description,
      unitprice: update.unitprice,
      date_added: update.date_added,
      imgurl: update.imgurl,
      quantity: update.quantity,
      isdeleted: update.isdeleted ? 1 : 0,
      createdAt: update.createdAt,
      BrandId: update.brand_id,
      CategoryId: update.category_id,
      brand,
      category,
    };

    return successMessageProduct(res, 200, 'Product updated', product);
  } catch (error) {
    return errorMessageProduct(
      res,
      500,
      `Something went wrong when updating the product:  ${error.message}`,
    );
  }
});

router.delete('/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Products']
  // #swagger.parameters['id'] = { description: 'Product id', type: 'integer' }
  // #swagger.description = "Delete an existing product (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = { description: 'Product deleted' } 
     #swagger.responses[400] = { description: 'Invalid product id' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
     #swagger.responses[404] = { description: 'Product not found / Cannot delete product with orders' } 
     #swagger.responses[500] = { description: 'Internal server error' } */
  try {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
      return errorMessage(res, 400, 'Id must be a positive number');
    }

    const productDeleted = await productService.delete(id);

    if (!productDeleted) {
      return errorMessage(res, 404, `Product with id ${id} not found`);
    }

    return successMessage(res, 200, {
      result: `Product with id ${id} has been deleted`,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when deleting the product `,
    );
  }
});

module.exports = router;
