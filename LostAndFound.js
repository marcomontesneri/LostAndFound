/* Requierements */
var express = require('express'),
	mongoose = require('mongoose');
	
/* Setup mongoose */
var mongourl = process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf';
mongoose.connect(mongourl);

var Schema = mongoose.Schema,
	Contact = mongoose.model('Contact', new Schema({
		firstName: String,
		lastName: String
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

/* Create the app */
var app = express.createServer();

app.configure(function(){
	app.use(express.bodyParser());
	app.use('/static', express.static(__dirname + '/static'));
});

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {
	layout: false
});

app.get('/', function(req, res) {
	res.render('index');
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