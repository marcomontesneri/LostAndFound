(function() {
  var Authentication, LocalStrategy, User, authenticate, common, passport;

  LocalStrategy = (require('passport-local')).Strategy;

  common = require('../common');

  passport = common.passport;

  User = require('../data/User');

  authenticate = function(email, password, done) {
    return User.findOne({
      email: email
    }, function(err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, {
          message: 'user not found'
        });
      }
      user.comparePassword(password, function(err, res) {
        if (res) {
          return done(null, user, {
            message: 'Welcome !'
          });
        } else {
          return done(null, false, {
            message: 'wrong password'
          });
        }
      });
      return true;
    });
  };

  Authentication = (function() {

    function Authentication() {
      passport.use(this.strategy);
      passport.serializeUser(function(user, done) {
        done(null, user.email);
        return true;
      });
      passport.deserializeUser(function(email, done) {
        return User.findCleanedOne(email, function(err, user) {
          return done(err, user);
        });
      });
    }

    Authentication.prototype.strategy = new LocalStrategy({
      usernameField: 'email',
      paswordField: 'password'
    }, authenticate);

    Authentication.prototype.isLambda = function(req, res, next) {
      if (!req.isAuthenticated) {
        req.flash('error', 'you need to be logged');
        res.redirect('/login');
      }
      return next();
    };

    Authentication.prototype.isVolunteer = function(req, res, next) {
      if (!req.isAuthenticated) {
        req.flash('error', 'you need to be logged');
        res.redirect('/login');
      }
      if (!(req.user.role === 'volunteer' || req.user.role === 'admin')) {
        req.flash('error', 'you are not allowed');
        res.redirect('/login');
      }
      return next();
    };

    Authentication.prototype.isAuthenticated = function(req, res, next) {
      if (!req.isAuthenticated) {
        req.flash('error', 'you need to be logged');
        res.redirect('/login');
      }
      return next();
    };

    Authentication.prototype.isAdmin = function(req, res, next) {
      if (!req.isAuthenticated) {
        req.flash('error', 'you need to be logged');
        res.redirect('/login');
      }
      if (req.user.role !== 'admin') {
        req.flash('error', 'you are not allowed');
        res.redirect('/login');
      }
      return next();
    };

    return Authentication;

  })();

  module.exports = new Authentication;

}).call(this);
