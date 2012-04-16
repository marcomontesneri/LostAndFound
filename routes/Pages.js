var Data = require('../core/Data'),
	Auth = require('../core/Auth');

var User = Data.User,
	Category = Data.Category,
	Storage = Data.Storage,
	Lost = Data.Lost,
	Found = Data.Found;

module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('home', { 
			user : req.user,
			error: req.flash('error')
		});
	});
	
	app.get('/login', function(req, res) {
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
		Category.find({}, function(err, categories){
            res.render('categories', { 
        		user : req.user,
    			error: req.flash('error') || err,
                categories: categories
    		});
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
	
	app.get('/user', Auth.ensureAdmin, function(req, res) {
		User.find({}, {_id:0, password: 0}, function(err, users) {
			res.render('user', { 
				user : req.user,
				error: req.flash('error') || err,
				users: users
			});
		});		
	});
	
	app.post('/user', Auth.ensureAdmin, function(req, res) {
		User.create(req.body.user, function(createErr, user) {
			User.find({}, {_id:0, password: 0}, function(err, users) {
				res.render('user', { 
					user : req.user,
					error: (createErr ? "Something went wrong" : undefined) || req.flash('error') || err,
					users: users,
					createdUser: user
				});
			});
		});		
	});
	
	app.get('/register', function(req, res) {
		res.render('register', { 
			user : req.user,
			error: req.flash('error')
		});
	});
};