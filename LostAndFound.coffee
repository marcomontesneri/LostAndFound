common = require './common'
common.init()
Auth = require './core/Authentication'

# Middleware settings

express = common.express
app = common.app
flash = common.flash;
passport = common.passport

app.configure ->
	app.use '/static', express.static(__dirname + '/static')
	app.use express.bodyParser()
	app.use express.cookieParser()
	app.use express.methodOverride()
	app.use express.session
		secret: 'awesome unicorns'
		maxAge: new Date Date.now()+60*60*1000
		store: new common.mongoStore
			db: common.mongoose.connection.db
			, (err) -> console.log err || 'connect-mongo setup ok'
  app.use flash()
	app.use passport.initialize()
	app.use passport.session()
	app.use app.router

# View engine settings
app.set 'view engine', 'jade'
app.set 'views', __dirname + '/views'
app.set 'view options',
	layout: false


# Routes
require('./routes/Pages') app, passport
require('./routes/Api') app

# App launch !
app.listen common.port
console.log "listening on port ", common.port
console.log "mongodb url ", common.mongourl
console.log "node env ", common.env
