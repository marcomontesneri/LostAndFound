(function() {
  var Schema, attributes, bcrypt, cleaningOptions, common, model, mongoose, schema;

  common = require('./../common');

  bcrypt = require('bcrypt');

  mongoose = common.mongoose;

  Schema = mongoose.Schema;

  cleaningOptions = {
    _id: 0,
    password: 0
  };

  attributes = {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    address: String,
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      set: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      }
    },
    role: String
  };

  schema = new Schema(attributes, {
    strict: true
  });

  schema.methods.comparePassword = function(password, callback) {
    return bcrypt.compare(password, this.password, callback);
  };

  model = mongoose.model('User', schema);

  model.findCleanedOne = function(email, callback) {
    return this.findOne({
      email: email
    }, cleaningOptions, callback);
  };

  model.findCleaned = function(callback) {
    return this.find({
      useless: 'filter'
    }, cleaningOptions, callback);
  };

  module.exports = model;

}).call(this);
