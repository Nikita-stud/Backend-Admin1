var express = require('express');
var router = express.Router();

const { successMessage, errorMessage } = require('../helpers/generalResponse');

var db = require('../models');
var RoleService = require('../services/RoleService');
var roleService = new RoleService(db);
var UserService = require('../services/UserService');
var userService = new UserService(db);
var MembershipService = require('../services/MembershipService');
var membershipService = new MembershipService(db);
var BrandService = require('../services/BrandService');
var brandService = new BrandService(db);
var CategoryService = require('../services/CategoryService');
var categoryService = new CategoryService(db);
var ProductService = require('../services/ProductService');
var productService = new ProductService(db);

router.post('/init', async function (req, res, next) {
  // #swagger.tags = ['Initialization']
  // #swagger.description = "Fill the database with initial data (Roles, Memberships, Admin user, Products, Brands, Categories)"
  // #swagger.produces = ['application/json']
  /* #swagger.responses[201] = { description: 'Initialization completed' }
     #swagger.responses[400] = { description: 'Database has already been populated' }
    #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    if (await productService.count()) {
      return errorMessage(res, 400, 'Database has already been populated');
    }

    const response = await fetch('http://backend.restapi.co.za/items/products');

    if (!response.ok) {
      return errorMessage(
        res,
        500,
        'Something went wrong when fetching data from http://backend.restapi.co.za/items/products',
      );
    }

    const json = await response.json();
    const products = json.data;

    await db.sequelize.transaction(async (toCheck) => {
      await roleService.populateRoles(toCheck);
      await membershipService.populateMemberships(toCheck);
      await userService.createAdmin(toCheck);

      for (const product of products) {
        try {
          const brand = await brandService.createIfDoesNotExist(
            product.brand,
            toCheck,
          );
          const category = await categoryService.createIfDoesNotExist(
            product.category,
            toCheck,
          );

          await productService.create(
            {
              ...product,
              unitprice: product.price,
              brand_id: brand.id,
              category_id: category.id,
            },
            toCheck,
          );
        } catch (error) {
          throw new Error(
            `Something went wrong when adding ${product.name}: ${error.message}`,
          );
        }
      }
    });

    return successMessage(res, 201, { result: 'Database has been populated' });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when populating the database:  ${error.message}`,
    );
  }
});

module.exports = router;
