var express = require('express');
var router = express.Router();

const isAuth = require('../middleware.js/isAuth');
const isAdmin = require('../middleware.js/isAdmin');

const { successMessage, errorMessage } = require('../helpers/generalResponse');

var db = require('../models');
var BrandService = require('../services/BrandService');
var brandService = new BrandService(db);

router.get('/', async function (req, res, next) {
  // #swagger.tags = ['Brands']
  // #swagger.description = "Get all brands"
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Brand found' }
     #swagger.responses[404] = { description: 'Brands not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const brands = await brandService.getAll();

    if (!brands || brands.length === 0) {
      return errorMessage(res, 404, 'No brands found');
    }

    return successMessage(res, 200, {
      result: 'Brands found',
      brands,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the brands:  ${error.message}`,
    );
  }
});

router.get('/:id', async function (req, res, next) {
  // #swagger.tags = ['Brands']
  // #swagger.parameters['id'] = { description: 'Brand id', type: 'integer' }
  // #swagger.description = "Get a brand by id"
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Brand found' }
     #swagger.responses[400] = { description: 'Invalid brand id' }
     #swagger.responses[404] = { description: 'Brand not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }

  try {
    const brand = await brandService.getSingleBrand(id);
    if (!brand) {
      return errorMessage(res, 404, `No brand with id ${id} found`);
    }

    return successMessage(res, 200, {
      result: 'Brand found',
      brand,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the brand with id ${id}:  ${error.message}`,
    );
  }
});

router.post('/', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Brands']
  // #swagger.description = "Create a new brand (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Brand"
        }
  } */
  /* #swagger.responses[201] = { description: 'Brand created' }
     #swagger.responses[400] = { description: 'Missing/invalid name or brand already exists' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
    #swagger.responses[500] = { description: 'Internal server error' } */

  const { name } = req.body;

  try {
    if (!name?.trim()) {
      return errorMessage(res, 400, 'Name is required');
    }
    if (!isNaN(name)) {
      return errorMessage(res, 400, 'Name can not be a number');
    }

    const created = await brandService.create(name.trim());

    return successMessage(res, 201, {
      result: 'Brand created',
      created,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const existing = await brandService.findByName(name.trim());
      return errorMessage(
        res,
        400,
        `Brand with this name already exists under id: ${existing.id}`,
      );
    }
    return errorMessage(
      res,
      500,
      `Something went wrong when creating the brand:  ${error.message}`,
    );
  }
});

router.put('/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Brands']
  // #swagger.parameters['id'] = { description: 'Brand id', type: 'integer' }
  // #swagger.description = "Update an existing brand (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Brand"
        }
  } */
  /* #swagger.responses[200] = { description: 'Brand updated' }
     #swagger.responses[400] = { description: 'Missing/invalid name or brand already exists' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
    #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }

  const { name } = req.body;

  try {
    if (!name?.trim()) {
      return errorMessage(res, 400, 'Name is required');
    }
    if (!isNaN(name)) {
      return errorMessage(res, 400, 'Name can not be a number');
    }

    const update = await brandService.update(id, name.trim());

    if (!update) {
      return errorMessage(res, 404, `Brand with id ${id} not found`);
    }

    return successMessage(res, 200, {
      result: 'Brand updated',
      update,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const existing = await brandService.findByName(name.trim());

      return errorMessage(
        res,
        400,
        `Brand with this name already exists under id: ${existing.id}`,
      );
    }
    return errorMessage(
      res,
      500,
      `Something went wrong when updating the brand:  ${error.message}`,
    );
  }
});

router.delete('/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Brands']
  // #swagger.parameters['id'] = { description: 'Brand id', type: 'integer' }
  // #swagger.description = "Delete an existing brand (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = { description: 'Brand deleted' }
     #swagger.responses[400] = { description: 'Invalid brand id' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
     #swagger.responses[404] = { description: 'Brand not found / Cannot delete brand with products' } 
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);

  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }

  try {
    const category = await brandService.delete(id);

    if (!category) {
      return errorMessage(res, 404, `Brand with id ${id} not found`);
    }
    return successMessage(res, 200, {
      result: `Brand with id ${id} has been deleted`,
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return errorMessage(res, 400, 'Can not delete a brand that has products');
    }
    return errorMessage(
      res,
      500,
      `Something went wrong when deleting the brand:  ${error.message} `,
    );
  }
});

module.exports = router;
