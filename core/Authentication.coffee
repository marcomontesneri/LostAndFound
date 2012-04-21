# Requirements : passport and passport-local strategy
LocalStrategy = (require 'passport-local').Strategy
common = require '../common'
passport = common.passport
User = require '../data/User'

authenticate= (email, password, done) ->
    User.findOne
        email: email
        , (err, user) ->
            return done err if err
            return done null, false, {message: 'user not found'} if !user
            user.comparePassword password, (err, res) ->
                if res
                    done null, user,
                        message: 'Welcome !'
                else
                    done null, false,
                        message: 'wrong password'
            true

class Authentication

    constructor: () ->
        passport.use @strategy
        
        passport.serializeUser (user, done) ->
            done null, user.email
            true
        
        passport.deserializeUser (email, done) ->
            User.findCleanedOne email, (err, user) ->
                done err, user

    strategy: new LocalStrategy
        usernameField: 'email'
        paswordField: 'password'
        , authenticate

    isLambda: (req, res, next) ->
        unless req.isAuthenticated
            req.flash 'error', 'you need to be logged'
            res.redirect '/login'
        next()

    isVolunteer: (req, res, next) ->
        unless req.isAuthenticated
            req.flash 'error', 'you need to be logged'
            res.redirect '/login'
        unless req.user.role == 'volunteer' || req.user.role == 'admin'
            req.flash 'error', 'you are not allowed'
            res.redirect '/login'
        next()

    isAdmin: (req, res, next) ->
        unless req.isAuthenticated
            req.flash 'error', 'you need to be logged'
            res.redirect '/login'
        unless req.user.role == 'admin'
            req.flash 'error', 'you are not allowed'
            res.redirect '/login'
        next()

module.exports = new Authentication
