(function() {
  var Auth, Data, MongoStore, app, env, express, mongourl, passport, port;

  express = require('express');

  passport = require('passport');

  MongoStore = require('connect-mongodb');

  Data = require('./core/Data');

  Auth = require('./core/Auth');

  mongourl = process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf';

  port = process.env.PORT || 9001;

  env = process.argv[2] || process.env.NODE_ENV || 'development';

  Data.connect(mongourl);

  app = express.createServer();

  app.configure(function() {
    app.use('/static', express.static(__dirname + '/static'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.session({
      secret: 'awesome unicorns',
      maxAge: new Date(Date.now() + 3600000),
      store: new MongoStore({
        db: Data.mongoose.connection.db
      }, function(err) {
        return console.log(err || 'connect-mongodb setup ok');
      })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    return app.use(app.router);
  });

  Auth.initialize(passport);

  app.set('view engine', 'jade');

  app.set('views', __dirname + '/views');

  app.set('view options', {
    layout: false
  });

  require('./routes/Pages')(app, passport);

  require('./routes/Api')(app);

  app.listen(port);

  console.log("listening on port ", port);

  console.log("mongodb url ", mongourl);

  console.log("node env ", env);

}).call(this);
