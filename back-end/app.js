var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { errorMessage } = require('./helpers/generalResponse');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var categoriesRouter = require('./routes/categories');
var brandsRouter = require('./routes/brands');
var productsRouter = require('./routes/products');
var membershipsRouter = require('./routes/memberships');
var cartRouter = require('./routes/cart');
var ordersRouter = require('./routes/orders');
var searchRouter = require('./routes/search');

require('dotenv').config();

var db = require('./models');
db.sequelize.sync().catch((error) => {
  console.error(error);
});

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/memberships', membershipsRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/search', searchRouter);

app.use(bodyParser.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  return errorMessage(res, 404, 'Endpoint not found');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
