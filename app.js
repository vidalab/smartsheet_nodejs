var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

var routes = require('./routes/index');
var users  = require('./routes/users');

var models  = require('./models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('port', (process.env.PORT || 5000));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session store
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, 'config', 'config.json'))[env];
if (process.env.DATABASE_URL) {
  var sequelizeDb = new Sequelize(process.env.DATABASE_URL,config);
} else {
  var sequelizeDb = new Sequelize(config.database, config.username, config.password, config);
}

var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

function extendDefaultFields(defaults, session) {
  return {
    data: defaults.data,
    expires: defaults.expires,
    userId: session.userId
  };
}

var sessionStore = new SequelizeStore({
  db: sequelizeDb,
  extendDefaultFields: extendDefaultFields
});

app.use(session({
  secret: 'vidasecrettok',
  resave: true,
  saveUninitialized: true,
  store: sessionStore
}));

sessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/', routes);
app.use('/users', users);

app.get('/auth/smartsheet',
  passport.authenticate('smartsheet'));

app.get('/auth/smartsheet/callback',
  passport.authenticate('smartsheet', { failureRedirect: '/' }),
  function(req, res) {
    req.logIn(req.user, function(err) {
      res.redirect('/');
    });
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

module.exports = app;
