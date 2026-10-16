var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const { promisify } = require('util');
const pbkdf2 = promisify(crypto.pbkdf2);
const jwt = require('jsonwebtoken');

const isAuth = require('../middleware.js/isAuth');
const isAdmin = require('../middleware.js/isAdmin');

const { successMessage, errorMessage } = require('../helpers/generalResponse');

var db = require('../models');
var UserService = require('../services/UserService');
var userService = new UserService(db);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s]+$/;

router.post('/register', async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = "Register a new user"
  // #swagger.produces = ['application/json']
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Register"
        }
      
  } */
  /* #swagger.responses[200] = { description: 'User registered' }
     #swagger.responses[400] = { description: 'Invalid user data' }
     #swagger.responses[500] = { description: 'Internal server error' } */
  try {
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      address,
      City,
      phone,
    } = req.body;

    if (!firstname?.trim() || !lastname?.trim() || !username?.trim()) {
      return errorMessage(
        res,
        400,
        'Firstname, lastname and username are required',
      );
    }
    if (!password?.trim() || !email?.trim()) {
      return errorMessage(res, 400, 'Password and email are required');
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return errorMessage(res, 400, 'Email is wrong format');
    }

    if (!address?.trim() || !City?.trim() || !phone?.trim()) {
      return errorMessage(res, 400, 'Address, City and phone are required');
    }

    if (!PHONE_REGEX.test(phone.trim())) {
      return errorMessage(res, 400, 'Phone is wrong format');
    }

    var salt = crypto.randomBytes(16);
    const hashedPassword = await pbkdf2(password, salt, 310000, 32, 'sha256');

    await userService.register(
      firstname.trim(),
      lastname.trim(),
      username.trim(),
      email.trim().toLowerCase(),
      address.trim(),
      City.trim(),
      phone.trim(),
      hashedPassword,
      salt,
    );

    return successMessage(res, 200, { result: `You created an account.` });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return errorMessage(
        res,
        400,
        `Participant with this username or email already exists`,
      );
    }
    return errorMessage(
      res,
      500,
      'Something went wrong when registering a user',
    );
  }
});

router.post('/login', async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = "Login a registered user with email or username and password"
  // #swagger.produces = ['application/json']
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/Login"
        }
      
  } */
  /* #swagger.responses[200] = { description: 'User logged in' }
     #swagger.responses[400] = { description: 'Invalid user data' }
     #swagger.responses[401] = { description: 'Incorrect username/email or password' }
     #swagger.responses[500] = { description: 'Internal server error' } */
  try {
    const { username, email, password } = req.body;

    if (!username?.trim() && !email?.trim()) {
      return errorMessage(res, 400, 'Username or email are required');
    }

    if (!password?.trim()) {
      return errorMessage(res, 400, 'Password is required');
    }

    const loginName = username?.trim() || email.trim().toLowerCase();

    const user = await userService.getOne(loginName);

    if (user === null) {
      return errorMessage(res, 401, 'Incorrect username/email or password');
    }

    const hashedPassword = await pbkdf2(
      password,
      user.salt,
      310000,
      32,
      'sha256',
    );

    if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
      return errorMessage(res, 401, 'Incorrect password');
    }

    let token;

    try {
      token = jwt.sign(
        { id: user.id, email: user.email, role: user.role_id },
        process.env.TOKEN_SECRET,
        { expiresIn: '2h' },
      );
    } catch (err) {
      return errorMessage(
        res,
        500,
        'Something went wrong with creating JWT token',
      );
    }
    return successMessage(res, 200, {
      result: 'You are logged in',
      id: user.id,
      email: user.email,
      name: user.firstName,
      role: user.role_id,
      token: token,
    });
  } catch (error) {
    return errorMessage(res, 500, 'Something went wrong when logging in');
  }
});

router.get('/users', isAuth, isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = "Get all users (Requires authentication and admin privileges)"
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'Users found' }
     #swagger.responses[404] = { description: 'Users not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  try {
    const users = await userService.getAll();

    if (users.length === 0) {
      return errorMessage(res, 404, 'No users found');
    }

    return successMessage(res, 200, {
      result: 'Users found',
      users,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when fetching the users:  ${error.message}`,
    );
  }
});

router.put('/users/:id', isAuth, isAdmin, async function (req, res, next) {
  // #swagger.tags = ['Authentication']
  // #swagger.parameters['id'] = { description: 'User id', type: 'integer' }
  // #swagger.description = "Update an existing user (Requires authentication and admin privileges)"
  // #swagger.produces = ['application/json']
  // #swagger.security = [{ "bearerAuth": [] }]
  /* #swagger.parameters['body'] = {
      "name": "body",
      "in": "body",
        "schema": {
          $ref: "#/definitions/MakeAdmin"
        }
  } */
  /* #swagger.responses[200] = { description: 'User updated' }
     #swagger.responses[400] = { description: 'Missing/invalid role' }
     #swagger.responses[401] = { description: 'Missing or invalid token' }
     #swagger.responses[403] = { description: 'Admin only' } 
    #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }

  const role_id = Number(req.body.role_id);

  try {
    if (!role_id || (role_id !== 1 && role_id !== 2)) {
      return errorMessage(res, 400, 'Role is required');
    }

    const update = await userService.update(id, role_id);

    if (!update) {
      return errorMessage(res, 404, `User with id ${id} not found`);
    }

    return successMessage(res, 200, {
      result: 'User updated',
      update,
    });
  } catch (error) {
    return errorMessage(
      res,
      500,
      `Something went wrong when updating the user:  ${error.message}`,
    );
  }
});

router.delete('/users/:id', isAuth, isAdmin, async (req, res, next) => {
  // #swagger.tags = ['Authentication']
  // #swagger.description = "Delete a user (Requires authentication and admin privileges)"
  // #swagger.parameters['id'] = { description: 'User id', type: 'integer' }
  // #swagger.security = [{ "bearerAuth": [] }]
  // #swagger.produces = ['application/json']
  /* #swagger.responses[200] = { description: 'User deleted' }
     #swagger.responses[400] = { description: 'Invalid user id / Cannot delete user with orders' }
     #swagger.responses[404] = { description: 'User not found' }
     #swagger.responses[500] = { description: 'Internal server error' } */

  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return errorMessage(res, 400, 'Id must be a positive number');
  }
  try {
    const userDeleted = await userService.delete(id);

    if (!userDeleted) {
      return errorMessage(res, 404, `User with id ${id} not found`);
    }

    return successMessage(res, 200, {
      result: `User with id ${id} has been deleted`,
    });
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return errorMessage(res, 400, 'Can not delete a user that has orders');
    }
    return errorMessage(
      res,
      500,
      `Something went wrong when deleting the user:  ${error.message}`,
    );
  }
});

module.exports = router;
