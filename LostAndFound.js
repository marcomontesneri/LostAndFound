/* Requierements */
var express = require('express'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	sha1 = require('sha1');
	
/* Setup mongoose */
var mongourl = process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf';
mongoose.connect(mongourl);

var saltySha1 = function(v) {
	return sha1('unicorns' + v + 'AreAwesome');
};

var Schema = mongoose.Schema,
	User = mongoose.model('User', new Schema({
		firstName:  {
			type:String,
			required: true,
		},
		lastName: {
			type:String,
			required: true,
		},
		email: {
			type:String,
			required: true,
			unique: true
		},
		address: String,
		phone: {
			type:String,
			required: true,
		},
		password:  {
			type:String,
			required: true,
			unique: true,
			set: saltySha1
		},
		role: String
	})),
	Category = mongoose.model('Category', new Schema({
		label: String,
		fields: [String]
	})),
	Storage = mongoose.model('Storage', new Schema({
		desc: String,
		state: String
	})),
	Lost = mongoose.model('Lost', new Schema({
		shortDesc: String,
		lostOn: Date,
		declaredOn: Date,
		where: String,
		owner: String,
		category: String,
		fields: [{
			label: String,
			value: String
		}]
	})),
	Found = mongoose.model('Found', new Schema({
		shortDesc: String,
		foundOn: Date,
		broughtOn: Date,
		where: String
	}));

/* Configure passport for localStrateg */
passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done) {
		User.findOne({email:email}, function(err, user){
			if(err) { return done(err); }
			if(!user) {
				return done(null, false, { message: 'Unknow user' });
			}
			if(!(user.password == saltySha1(password))) {
				return done(null, false, { message: 'Invalid password' });
			}
			return done(null, user, { message: 'Welcome ;)'});
		});
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(function(email, done) {
	User.findOne({email:email}, function(err, user) {
		done(err, user);	
	});
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	req.flash('error', 'You need to be logged');
	res.redirect('/login');
}
function ensureAdmin(req, res, next) {
	if (! req.isAuthenticated()) {
		req.flash('error', 'You need to be logged');
		res.redirect('/login');
	} else {
		if(req.user.role == "admin") return next();
		req.flash('error', 'You are not allowed :(');
		res.redirect('/login');
	}
	
}
function ensureVolunteer(req, res, next) {
	if (! req.isAuthenticated()) {
		req.flash('error', 'You need to be logged');
		res.redirect('/login');
	} else {
		if(req.user.role == "admin" || req.user.role == "volunteer") return next();
		req.flash('error', 'You are not allowed :(');
		res.redirect('/login');
	}
}

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

app.get('/categories', ensureAdmin, function(req, res) {
	res.render('categories', { 
		user : req.user,
		error: req.flash('error')
	});
});

app.get('/declareLoss', ensureAuthenticated, function(req, res) {
	res.render('declareLoss', { 
		user : req.user,
		error: req.flash('error')
	});
});

app.get('/loss', ensureVolunteer, function(req, res) {
	res.render('loss', { 
		user : req.user,
		error: req.flash('error')
	});
});

app.get('/createUser', ensureAdmin, function(req, res) {
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

app.get('/api/losts', function(req, res) {
	var losts = Lost.find({}, function(err, doc) {
		res.send(doc);
	});
});

app.post('/api/lost', function(req, res) {
	Lost.create(req.body.lost, function(err, doc) {
		if(!err) {
			res.send({
				result:'ok',
				lost: doc
			});
		} else {
			res.send({
				result:'error',
				error: err
			});
		}
	});
});

app.post('/api/register', function(req, res) {
	var user = req.body.user;
	user.role = 'lambda';
	User.create(user, function(err, doc) {
		if(!err) {
			res.json({
				result:'ok',
				lost: doc
			});
		} else {
			res.json({
				result:'error',
				error: err
			});
		}
	});
});

app.post('/api/createUser', ensureAdmin, function(req, res) {
	User.create(req.body.user, function(err, doc) {
		if(!err) {
			res.json({
				result:'ok',
				lost: doc
			});
		} else {
			res.json({
				result:'error',
				error: err
			});
		}
	});
});

app.post('/api/category', function(req, res) {
	Category.create(req.body.category, function(err, doc) {
		if(!err) {
			res.send({
				result:'ok',
				category: doc
			});
		} else {
			res.send({
				result:'error',
				error: err
			});
		}
	});
});

app.get('/api/categories', function(req, res){
	Category.find({}, function(err, doc){
		res.send(doc);
	});
});

var port = process.env.PORT || 9001;
var env = process.argv[2] || process.env.NODE_ENV || 'development';
app.listen(port);
console.log("listening on port ", port);
console.log("mongodb url ", mongourl);
console.log("node env", env);