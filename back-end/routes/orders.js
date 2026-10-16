var express = require('express');
var router = express.Router();

const isAuth = require('../middleware.js/isAuth');
const isAdmin = require('../middleware.js/isAdmin');

const { successMessage, errorMessage } = require('../helpers/generalResponse');

var db = require('../models');
var OrderService = require('../services/OrderService');
var orderService = new OrderService(db);

router.get('/', isAuth, async function (req, res, next) {
  // #swagger.tags = ['Orders']
  // #swagger.description = "Get all orders for the authenticated user (Requires authentication)"
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Order found' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
     #swagger.responses[404] = { description: 'Orders not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const userId = req.user.id;
    const orders = await orderService.getAll(userId, req.user.role);

    if (!orders || orders.length === 0) {
      return errorMessage(res, 404, 'No orders found');
    }
    return successMessage(res, 200, {
      result: 'Orders found',
      orders,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the orders:  ${error.message}`,
    );
  }
});

router.get('/:id', isAuth, async function (req, res, next) {
  // #swagger.tags = ['Orders']
  // #swagger.parameters['id'] = { description: 'Order id', type: 'integer' }
  // #swagger.description = "Get a specific order by id (Requires authentication)"
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Order found' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
     #swagger.responses[404] = { description: 'Order not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }

  try {
    const userId = req.user.id;
    const order = await orderService.getSingleOrder(id, userId, req.user.role);
    if (!order) {
      return errorMessage(res, 404, `No order with id ${id} found`);
    }

    return successMessage(res, 200, {
      result: 'Order found',
      order,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the order with id ${id}:  ${error.message}`,
    );
  }
});

router.put('/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Orders']
  // #swagger.parameters['id'] = { description: 'Order id', type: 'integer' }
  // #swagger.description = "Update the status of a specific order by id (Requires authentication and admin privileges)"
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.produces = ['application/json']
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Status"
        }
      
  } */
  /* #swagger.responses[200] = { description: 'Order updated' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
     #swagger.responses[404] = { description: 'Order not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }
  try {
    const { status } = req.body;
    const allowedStatuses = ['In Progress', 'Ordered', 'Completed'];

    if (!status) {
      return errorMessage(res, 400, 'Status is required');
    }

    if (!allowedStatuses.includes(status)) {
      return errorMessage(
        res,
        400,
        'Invalid status, must be one of: In Progress, Ordered, Completed',
      );
    }

    const update = await orderService.updateStatus(id, status);

    if (!update) {
      return errorMessage(res, 404, `Order with id ${id} not found`);
    }

    return successMessage(res, 200, {
      result: 'Order updated',
      update,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when updating the order status:  ${error.message}`,
    );
  }
});

module.exports = router;
