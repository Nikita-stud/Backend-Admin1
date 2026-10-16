var express = require('express');
var router = express.Router();
const crypto = require('crypto');

const isAuth = require('../middleware.js/isAuth');

const { successMessage, errorMessage } = require('../helpers/generalResponse');

var db = require('../models');
var CartService = require('../services/CartService');
var cartService = new CartService(db);
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);
var UserService = require('../services/UserService');
var userService = new UserService(db);
var OrderService = require('../services/OrderService');
var orderService = new OrderService(db);

var OrderProductService = require('../services/OrderProductService');
var orderProductService = new OrderProductService(db);
const MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(db);

router.get('/', isAuth, async function (req, res, next) {
  // #swagger.tags = ['Cart']
  // #swagger.description = "Get all items in the cart (Requires authentication)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[200] = { description: 'Cart items found' }
     #swagger.responses[404] = { description: 'No items in cart found' }
     #swagger.responses[500] = { description: 'Internal server error' } */
  try {
    const userId = req.user.id;

    const [cart, user] = await Promise.all([
      cartService.getAll(userId),
      userService.getOnesMembership(userId),
    ]);

    if (!cart || cart.length === 0) {
      return errorMessage(res, 404, 'No items in cart found');
    }

    return successMessage(res, 200, {
      result: 'Cart items found',
      discount: user.Membership.discount,
      cart,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the cart:  ${error.message}`,
    );
  }
});

router.post('/', isAuth, async function (req, res, next) {
  // #swagger.tags = ['Cart']
  // #swagger.description = "Update the cart (Requires authentication)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Cart"
        }
  } */
  /* #swagger.responses[201] = { description: 'Cart items updated' }
     #swagger.responses[400] = { description: 'Quantity must be positive' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[404] = { description: 'No items in cart found/ Id of item not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || isNaN(productId)) {
      return errorMessage(
        res,
        400,
        'Product id is required and must be a number',
      );
    }
    if (quantity < 1 || isNaN(quantity)) {
      return errorMessage(res, 400, 'Quantity must be a positive number');
    }

    const product = await productService.getSingleProduct(productId, 2);

    if (!product) {
      return errorMessage(res, 404, `Product with id ${productId} not found`);
    }

    if (product.quantity === 0) {
      return errorMessage(res, 400, `${product.name} is out of stock`);
    }

    const inCart = await cartService.ifInCart(userId, productId);
    const productsInCart = inCart ? inCart.quantity : 0;

    if (productsInCart + quantity > product.quantity) {
      return errorMessage(
        res,
        400,
        `Of ${product.name} there are ${product.quantity} left in stock`,
      );
    }

    await cartService.addOrGetRid(userId, productId, quantity);

    const [cart, user] = await Promise.all([
      cartService.getAll(userId),
      userService.getOnesMembership(userId),
    ]);

    return successMessage(res, 201, {
      result: 'Cart updated',
      discount: user.Membership.discount,
      cart,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when updated the cart:  ${error.message}`,
    );
  }
});

router.post('/checkout/now', isAuth, async function (req, res, next) {
  // #swagger.tags = ['Cart']
  // #swagger.description = "Checkout cart (Requires authentication)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.responses[201] = { description: 'Order created' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[404] = { description: 'No items in cart found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const userId = req.user.id;

    const [cart, user] = await Promise.all([
      cartService.getAll(userId),
      userService.getOnesMembership(userId),
    ]);

    if (!cart || cart.length === 0) {
      return errorMessage(res, 404, 'No items in cart found');
    }

    const fullPrice = cart.reduce(
      (total, product) => total + product.total_price,
      0,
    );
    const userDiscount = user.Membership.discount;
    const total = fullPrice * (1 - userDiscount / 100);

    for (const product of cart) {
      const foundProduct = await productService.getSingleProduct(
        product.product_id,
        2,
      );
      if (!foundProduct || product.quantity > foundProduct.quantity) {
        return errorMessage(res, 400, `Not enough stock for ${product.name}`);
      }
    }

    const orderId = crypto.randomBytes(4).toString('hex');

    const order = await db.sequelize.transaction(async (toCheck) => {
      const orderCreated = await orderService.create(
        {
          order_number: orderId,
          discount: userDiscount,
          total: total,
          user_id: userId,
          membership_id: user.membership_id,
        },
        toCheck,
      );

      for (const product of cart) {
        await orderProductService.create(
          {
            order_id: orderCreated.id,
            product_id: product.product_id,
            quantity: product.quantity,
            unit_price: product.unitprice,
          },
          toCheck,
        );

        await productService.reduce(
          product.product_id,
          product.quantity,
          toCheck,
        );
      }

      await cartService.clear(userId, toCheck);

      return orderCreated;
    });

    const totalBought = await orderProductService.totalBoughtByUser(userId);
    const membershipStatus =
      await membershipService.calculateBought(totalBought);

    if (membershipStatus.id !== user.membership_id) {
      await userService.updateMembership(userId, membershipStatus.id);
    }

    return successMessage(res, 201, {
      result: 'Order created',
      discount: userDiscount,
      membership: membershipStatus.name,
      order,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when creating the order:  ${error.message}`,
    );
  }
});

module.exports = router;
