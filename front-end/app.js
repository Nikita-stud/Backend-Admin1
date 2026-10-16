var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var requireAdmin = require('./middleware/requireAdmin');
var indexRouter = require('./routes');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');
var brandsRouter = require('./routes/brands');
var ordersRouter = require('./routes/orders');
var membershipsRouter = require('./routes/memberships');

var app = express();

app.use(
  session({
    secret: 'Secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 60 * 60 * 1000 },
  }),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/css',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')),
);
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')),
);

app.use('/', indexRouter);
app.use(requireAdmin);

app.use('/admin/users', usersRouter);
app.use('/admin/products', productsRouter);
app.use('/admin/categories', categoriesRouter);
app.use('/admin/brands', brandsRouter);
app.use('/admin/orders', ordersRouter);
app.use('/admin/memberships', membershipsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
