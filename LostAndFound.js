/* Requierements */
var express = require('express'),
	passport = require('passport'),
	Data = require('./core/Data'),
	Auth = require('./core/Auth');
	
/* Setup mongoose */
var mongourl = process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf';
Data.connect(mongourl);

Auth.initialize(passport);

var User = Data.User,
	Category = Data.Category,
	Storage = Data.Storage,
	Lost = Data.Lost,
	Found = Data.Found;

/* Create the app */
var app = express.createServer();

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

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {
	layout: false
});

app.get('/', function(req, res) {
	res.render('home', { 
		user : req.user,
		error: req.flash('error')
	});
});

app.get('/login', function(req, res) {
	console.log(res.local('error'), res.statusCode);
	res.render('login', { 
		user : req.user,
		error: res.local('error') || req.flash('error')
	});
});

app.post('/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
		successFlash: "Welcome :)"
	})
);

app.get('/logout', function(req, res){
	req.logOut();
	res.redirect('/');
});

app.get('/categories', Auth.ensureAdmin, function(req, res) {
	res.render('categories', { 
		user : req.user,
		error: req.flash('error')
	});
});

app.get('/declareLoss', Auth.ensureAuthenticated, function(req, res) {
	res.render('declareLoss', { 
		user : req.user,
		error: req.flash('error')
	});
});

app.get('/loss', Auth.ensureVolunteer, function(req, res) {
	res.render('loss', { 
		user : req.user,
		error: req.flash('error')
	});
});

app.get('/createUser', Auth.ensureAdmin, function(req, res) {
	res.render('createUser', { 
		user : req.user,
		error: req.flash('error')
	});
});

app.get('/register', function(req, res) {
	res.render('register', { 
		user : req.user,
		error: req.flash('error')
	});
});

require('./routes/Api')(app);

var port = process.env.PORT || 9001;
var env = process.argv[2] || process.env.NODE_ENV || 'development';
app.listen(port);
console.log("listening on port ", port);
console.log("mongodb url ", mongourl);
console.log("node env", env);