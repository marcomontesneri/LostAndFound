# Requierements
express = require 'express'
passport = require 'passport'
MongoStore = require 'connect-mongodb'
Data = require './core/Data'
Auth = require './core/Auth'
	
# Retrieve arg || env || defaults
mongourl = process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf'
port = process.env.PORT || 9001
env = process.argv[2] || process.env.NODE_ENV || 'development'

# Connect mongoose
Data.connect mongourl

# Express app creation
app = express.createServer()

# Middleware settings
app.configure ->
	app.use '/static', express.static(__dirname + '/static')
	app.use express.bodyParser()
	app.use express.cookieParser()
	app.use express.methodOverride()
	app.use express.session
		secret: 'awesome unicorns'
		maxAge: new Date Date.now()+3600000
		store: new MongoStore
			db: Data.mongoose.connection.db
			, (err) -> console.log err || 'connect-mongodb setup ok'
	app.use passport.initialize()
	app.use passport.session()
	app.use app.router

# Auth init
Auth.initialize passport

# View engine settings
app.set 'view engine', 'jade'
app.set 'views', __dirname + '/views'
app.set 'view options',
	layout: false


# Routes
require('./routes/Pages') app, passport
require('./routes/Api') app

# App launch !
app.listen port
console.log "listening on port ", port
console.log "mongodb url ", mongourl
console.log "node env ", env