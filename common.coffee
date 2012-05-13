class Common
    express: require 'express'
    passport: require 'passport'
    mongoose: require 'mongoose'
    mongoStore: require 'connect-mongodb'
    init: (mongourl, port, env) ->
        @app = @express.createServer()
        @mongourl = mongourl || process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf'
        @port = port || process.env.PORT || 9001
        @env = env || process.argv[2] || process.env.NODE_ENV || 'development'
        @mongoose.connect(@mongourl) # connect to mongo url
        this

instance = new Common

module.exports = instance

