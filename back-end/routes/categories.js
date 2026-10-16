var express = require('express');
var router = express.Router();

const isAuth = require('../middleware.js/isAuth');
const isAdmin = require('../middleware.js/isAdmin');

const { successMessage, errorMessage } = require('../helpers/generalResponse');

var db = require('../models');
var CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);

router.get('/', async function (req, res, next) {
  // #swagger.tags = ['Categories']
  // #swagger.description = "Get all categories"
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Category found' }
     #swagger.responses[404] = { description: 'Categories not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const categories = await categoryService.getAll();

    if (!categories || categories.length === 0) {
      return errorMessage(res, 404, 'No categories found');
    }

    return successMessage(res, 200, {
      result: 'Categories found',
      categories,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the categories:  ${error.message}`,
    );
  }
});

router.get('/:id', async function (req, res, next) {
  // #swagger.tags = ['Categories']
  // #swagger.description = "Get a single category by id"
  // #swagger.parameters['id'] = { description: 'Category id', type: 'integer' }
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Category found' }
     #swagger.responses[404] = { description: 'No category found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }

  try {
    const category = await categoryService.getSingleCategory(id);
    if (!category) {
      return errorMessage(res, 404, `No category with id ${id} found`);
    }

    return successMessage(res, 200, {
      result: 'Category found',
      category,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the category with id ${id}:  ${error.message}`,
    );
  }
});

router.post('/', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Categories']
  // #swagger.description = "Create a new category (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Category"
        }
  } */
  /* #swagger.responses[201] = { description: 'Category created' }
     #swagger.responses[400] = { description: 'Missing/invalid name or category already exists' }
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

    const created = await categoryService.create(name.trim());

    return successMessage(res, 201, {
      result: 'Category created',
      created,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const existing = await categoryService.findByName(name.trim());
      return errorMessage(
        res,
        400,
        `Category with this name already exists under id: ${existing.id}`,
      );
    }
    return errorMessage(
      res,
      500,
      `Something went wrong when creating the category:  ${error.message}`,
    );
  }
});

router.put('/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Categories']
  // #swagger.parameters['id'] = { description: 'Category id', type: 'integer' }
  // #swagger.description = "Update an existing category (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Category"
        }
  } */
  /* #swagger.responses[200] = { description: 'Category updated' }
     #swagger.responses[400] = { description: 'Missing/invalid name or category already exists' }
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

    const update = await categoryService.update(id, name.trim());

    if (!update) {
      return errorMessage(res, 404, `Category with id ${id} not found`);
    }

    return successMessage(res, 200, {
      result: 'Category updated',
      update,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const existing = await categoryService.findByName(name.trim());
      return errorMessage(
        res,
        400,
        `Category with this name already exists under id: ${existing.id}`,
      );
    }
    return errorMessage(
      res,
      500,
      `Something went wrong when updating the category:  ${error.message}`,
    );
  }
});

router.delete('/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Categories']
  // #swagger.parameters['id'] = { description: 'Category id', type: 'integer' }
  // #swagger.description = "Delete an existing category (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = { description: 'Category deleted' }
     #swagger.responses[400] = { description: 'Invalid category id' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
     #swagger.responses[404] = { description: 'Category not found / Cannot delete category with products' } 
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }

  try {
    const category = await categoryService.delete(id);

    if (!category) {
      return errorMessage(res, 404, `Category with id ${id} not found`);
    }
    return successMessage(res, 200, {
      result: `Category with id ${id} has been deleted`,
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return errorMessage(
        res,
        400,
        'Can not delete a category that has products',
      );
    }
    return errorMessage(
      res,
      500,
      `Something went wrong when deleting the category:  ${error.message} `,
    );
  }
});

module.exports = router;
