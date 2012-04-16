/*
 * Dependencies
 */
var LocalStrategy = require('passport-local').Strategy,
	Data = require('./Data');


function Auth() {};

var User = Data.User;

Auth.prototype.initialize = function(passport) {
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
				if(!(user.password == Data.saltySha1(password))) {
					return done(null, false, { message: 'Invalid password' });
				}
				return done(null, user, { message: 'Welcome !'});
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
}

Auth.prototype.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	req.flash('error', 'You need to be logged');
	res.redirect('/login');
};

Auth.prototype.ensureAdmin = function(req, res, next) {
	if (! req.isAuthenticated()) {
		req.flash('error', 'You need to be logged');
		res.redirect('/login');
	} else {
		if(req.user.role == "admin") return next();
		req.flash('error', 'You are not allowed :(');
		res.redirect('/login');
	}
	
};

Auth.prototype.ensureVolunteer = function(req, res, next) {
	if (! req.isAuthenticated()) {
		req.flash('error', 'You need to be logged');
		res.redirect('/login');
	} else {
		if(req.user.role == "admin" || req.user.role == "volunteer") return next();
		req.flash('error', 'You are not allowed :(');
		res.redirect('/login');
	}
};

module.exports = new Auth();