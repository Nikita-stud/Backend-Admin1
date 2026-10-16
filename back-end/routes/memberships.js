var express = require('express');
var router = express.Router();

const isAuth = require('../middleware.js/isAuth');
const isAdmin = require('../middleware.js/isAdmin');

const { successMessage, errorMessage } = require('../helpers/generalResponse');

var db = require('../models');
var MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(db);

router.get('/', async function (req, res, next) {
  // #swagger.tags = ['Memberships']
  // #swagger.description = "Get all memberships"
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Membership found' }
     #swagger.responses[404] = { description: 'Memberships not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const memberships = await membershipService.getAll();

    if (memberships.length === 0) {
      return errorMessage(res, 404, 'No memberships found');
    }

    return successMessage(res, 200, {
      result: 'Memberships found',
      memberships,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the memberships:  ${error.message}`,
    );
  }
});

router.get('/:id', async function (req, res, next) {
  // #swagger.tags = ['Memberships']
  // #swagger.description = "Get a single membership by id"
  // #swagger.parameters['id'] = { description: 'Membership id', type: 'integer' }
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Membership found' }
     #swagger.responses[404] = { description: 'No membership found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }
  try {
    const membership = await membershipService.getSingleMembership(id);
    if (!membership) {
      return errorMessage(res, 404, `No membership with id ${id} found`);
    }
    return successMessage(res, 200, {
      result: 'Membership found',
      membership,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the membership with id ${id}:  ${error.message}`,
    );
  }
});

router.put('/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Memberships']
  // #swagger.parameters['id'] = { description: 'Membership id', type: 'integer' }
  // #swagger.description = "Update an existing membership (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Membership"
        }
  } */
  /* #swagger.responses[200] = { description: 'Membership updated' }
     #swagger.responses[400] = { description: 'Missing/invalid discount or membership already exists' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
    #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }
  const { discount } = req.body;
  try {
    if (isNaN(discount)) {
      return errorMessage(res, 400, 'Discount is required and must be numbers');
    }

    if (discount < 0) {
      return errorMessage(res, 400, 'Discount can not be negative');
    }

    if (discount > 100) {
      return errorMessage(res, 400, 'Discount can not be more than 100');
    }

    const update = await membershipService.update(id, discount);

    if (!update) {
      return errorMessage(res, 404, `Membership with id ${id} not found`);
    }
    return successMessage(res, 200, {
      result: 'Membership updated',
      update,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return errorMessage(
        res,
        400,
        `Membership with this discount already exists`,
      );
    }
    return errorMessage(
      res,
      500,
      `Something went wrong when updating the membership:  ${error.message}`,
    );
  }
});

module.exports = router;
