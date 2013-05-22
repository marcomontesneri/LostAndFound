class Common
    express: require 'express'
    flash: require 'connect-flash'
    passport: require 'passport'
    mongoose: require 'mongoose'
    mongoStore: require('connect-mongo') @express
    init: (mongourl, port, env) ->
        @app = @express()
        @mongourl = mongourl || process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf'
        @port = port || process.env.PORT || 9001
        @env = env || process.argv[2] || process.env.NODE_ENV || 'development'
        @mongoose.connect(@mongourl) # connect to mongo url
        this

instance = new Common

module.exports = instance

