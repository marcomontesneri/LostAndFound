(function() {
  var Common, instance;

  Common = (function() {

    function Common() {}

    Common.prototype.express = require('express');

    Common.prototype.flash = require('connect-flash')

    Common.prototype.passport = require('passport');

    Common.prototype.mongoose = require('mongoose');

    Common.prototype.mongoStore = require('connect-mongodb');

    Common.prototype.init = function(mongourl, port, env) {
      this.app = this.express();
      this.mongourl = mongourl || process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf';
      this.port = port ||  process.env.PORT || 9001;
      this.env = env ||  process.argv[2] || process.env.NODE_ENV || 'development';
      this.mongoose.connect(this.mongourl);
      return this;
    };

    return Common;

  })();

  instance = new Common;

  module.exports = instance;

}).call(this);
