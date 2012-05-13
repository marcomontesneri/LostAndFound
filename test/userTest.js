(function() {
  var User, chai, common, should;

  chai = require('chai');

  should = chai.should();

  common = require('../common');

  common.init('mongodb://localhost:27017/test1');

  User = require('../data/User');

  describe('User', function() {
    var user, user2Data, userData;
    before(function() {
      return User.remove({}, function(err) {
        if (err) return console.log(err);
      });
    });
    user = null;
    userData = {
      firstName: 'UserTest1',
      lastName: 'ln',
      email: 'unique@email.org',
      phone: '0129201',
      password: 'password'
    };
    user2Data = {
      firstName: 'UserTest2',
      lastName: 'ln',
      email: 'unique2@email.org',
      phone: '01292012',
      password: 'password'
    };
    describe('Creation', function() {
      it('should construct with valid data', function(done) {
        return User.create(userData, function(err, doc) {
          should.not.exist(err);
          should.exist(doc);
          user = doc;
          return done();
        });
      });
      it('should save a different password', function() {
        return userData.password.should.not.equal(user.password);
      });
      return it('should validate original password', function() {
        return user.comparePassword(userData.password, function(err, res) {
          should.exist(res);
          should.not.exist(err);
          return res.should.be.ok;
        });
      });
    });
    describe('Creation constraints', function() {
      it('should be created if email differs', function(done) {
        return User.create(user2Data, function(err, doc) {
          should.not.exist(err);
          should.exist(doc);
          return done();
        });
      });
      it('should not allow duplicate email', function(done) {
        return User.create(userData, function(err, doc) {
          should.exist(err);
          should.not.exist(doc);
          return done();
        });
      });
      it('should not allow empty firstName', function(done) {
        var invalidUserData;
        invalidUserData = {
          firstName: null,
          lastName: 'noFirstName',
          email: 'uniqueNOFIRSTNAME@email.org',
          phone: '0129201',
          password: 'password'
        };
        return User.create(userData, function(err, doc) {
          should.exist(err);
          should.not.exist(doc);
          return done();
        });
      });
      it('should not allow empty lastName', function(done) {
        var invalidUserData;
        invalidUserData = {
          firstName: 'noLastName',
          lastName: null,
          email: 'uniqueNOLASTNAME@email.org',
          phone: '0129201',
          password: 'password'
        };
        return User.create(userData, function(err, doc) {
          should.exist(err);
          should.not.exist(doc);
          return done();
        });
      });
      it('should not allow empty email', function(done) {
        var invalidUserData;
        invalidUserData = {
          firstName: 'noEmail',
          lastName: 'lastName',
          email: null,
          phone: '0129201',
          password: 'password'
        };
        return User.create(userData, function(err, doc) {
          should.exist(err);
          should.not.exist(doc);
          return done();
        });
      });
      it('should not allow empty password', function(done) {
        var invalidUserData;
        invalidUserData = {
          firstName: 'noPassword',
          lastName: 'ln',
          email: 'noPassword@email.com',
          phone: '0129201',
          password: null
        };
        return User.create(userData, function(err, doc) {
          should.exist(err);
          should.not.exist(doc);
          return done();
        });
      });
      return it('should not allow empty phone', function(done) {
        var invalidUserData;
        invalidUserData = {
          firstName: 'noPhone',
          lastName: 'ln',
          email: 'noPhone@email.com',
          phone: null,
          password: 'password'
        };
        return User.create(userData, function(err, doc) {
          should.exist(err);
          should.not.exist(doc);
          return done();
        });
      });
    });
    describe('findCleanedOne', function() {
      it('should return a user on existing email filter', function(done) {
        return User.findCleanedOne({
          email: userData.email
        }, function(err, cleanedUser) {
          should.exist(cleanedUser);
          cleanedUser.email.should.equal(userData.email);
          return done();
        });
      });
      it('should not return password', function(done) {
        return User.findCleanedOne({
          email: userData.email
        }, function(err, cleanedUser) {
          should.exist(cleanedUser);
          cleanedUser.should.not.have.property('password');
          return done();
        });
      });
      it('should not return _id', function(done) {
        return User.findCleanedOne({
          email: userData.email
        }, function(err, cleanedUser) {
          should.exist(cleanedUser);
          cleanedUser.should.not.have.property('_id');
          return done();
        });
      });
      return it('should return nothing if filter is wrong', function(done) {
        return User.findCleanedOne({
          email: 'wrong'
        }, function(err, cleanedUser) {
          should.not.exist(cleanedUser);
          return done();
        });
      });
    });
    return describe('findCleaned', function() {
      it('should return everything with empty filter', function(done) {
        return User.findCleaned({}, function(err, cleanedUsers) {
          cleanedUsers.should.have.length(2);
          return done();
        });
      });
      it('should return only one user with a correct email filter', function(done) {
        return User.findCleaned({
          email: userData.email
        }, function(err, cleanedUsers) {
          cleanedUsers.should.have.length(1);
          cleanedUsers[0].email.should.equal(userData.email);
          return done();
        });
      });
      it('should not return any user with an unexisting email filter', function(done) {
        return User.findCleaned({
          email: 'unexisting'
        }, function(err, cleanedUsers) {
          cleanedUsers.should.have.length(0);
          return done();
        });
      });
      it('should not return password', function(done) {
        return User.findCleaned({}, function(err, cleanedUsers) {
          var cleanedUser, _fn, _i, _len;
          _fn = function(cleanedUser) {
            should.exist(cleanedUser);
            return cleanedUser.should.not.have.property('password');
          };
          for (_i = 0, _len = cleanedUsers.length; _i < _len; _i++) {
            cleanedUser = cleanedUsers[_i];
            _fn(cleanedUser);
          }
          return done();
        });
      });
      return it('should not return _id', function(done) {
        return User.findCleaned({}, function(err, cleanedUsers) {
          var cleanedUser, _fn, _i, _len;
          _fn = function(cleanedUser) {
            should.exist(cleanedUser);
            return cleanedUser.should.not.have.property('_id');
          };
          for (_i = 0, _len = cleanedUsers.length; _i < _len; _i++) {
            cleanedUser = cleanedUsers[_i];
            _fn(cleanedUser);
          }
          return done();
        });
      });
    });
  });

}).call(this);
