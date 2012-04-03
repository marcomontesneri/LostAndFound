/* Requierements */
var express = require('express'),
	passport = require('passport'),
	Data = require('./core/Data'),
	Auth = require('./core/Auth');
	
/* Setup mongoose */
var mongourl = process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf';
Data.connect(mongourl);

Auth.initialize(passport);

// Express ap creation
var app = express.createServer();

// Middleware settings
app.configure(function(){
	app.use('/static', express.static(__dirname + '/static'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({secret:'awesome unicorns'}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
});

// View engine settings
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {
	layout: false
});

// Declare routes
require('./routes/Pages')(app, passport);
require('./routes/Api')(app);

var port = process.env.PORT || 9001;
var env = process.argv[2] || process.env.NODE_ENV || 'development';
app.listen(port);
console.log("listening on port ", port);
console.log("mongodb url ", mongourl);
console.log("node env", env);