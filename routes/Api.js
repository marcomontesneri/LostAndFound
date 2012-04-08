var Data = require('../core/Data'),
	Auth = require('../core/Auth');

var User = Data.User,
	Category = Data.Category,
	Storage = Data.Storage,
	Lost = Data.Lost,
	Found = Data.Found;

module.exports = function(app) {
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

	app.get('/api/user', Auth.ensureAdmin, function(req, res) {
		User.find({}, {_id:0, password: 0}, function(err, users) {
			if(!err) {
				res.json(users);
			} else {
				return next(err);
			}
		});
	});

	app.post('/api/user', Auth.ensureAdmin, function(req, res) {
		User.create(req.body.user, function(err, user) {
			if(!err) {
				res.json({
					result:'ok',
					user: user
				});
			} else {
				res.json({
					result:'error',
					error: err
				});
			}
		});
	});

	app.put('/api/user/:email', Auth.ensureAdmin, function(req, res) {
		var user = req.body.user,
			email = req.params.email;
		User.update({email:email}, user, function(err, user) {
			if(!err) {
				res.json({
					result:'ok',
					user: email
				});
			} else {
				res.json({
					result:'error',
					error: err
				});
			}
		});
	});


	app.delete('/api/user/:email', Auth.ensureAdmin, function(req, res) {
		var email = req.params.email;
		User.findOne({email : email}, function(err, user) {
			if(!err) {
				if(!user) {
					res.json({
						result:'error',
						error: 'no user found'
					});
				} else {
					user.remove();
					res.json({
						result:'ok',
						email: email
					});
				}
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
};