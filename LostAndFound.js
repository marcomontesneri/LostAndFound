/* Requierements */
var http = require('http'),
	express = require('express'),
	mongoose = require('mongoose');
	
/* Setup mongoose */
mongoose.connect('mongodb://localhost/laf');
var Schema = mongoose.Schema,
	Contact = mongoose.model('Contact', new Schema({
		firstName: String,
		lastName: String
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
		owner: String
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

app.listen(8000);