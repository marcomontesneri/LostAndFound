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

	app.post('/api/createUser', Auth.ensureAdmin, function(req, res) {
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
}