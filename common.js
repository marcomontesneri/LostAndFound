(function() {
  var Common;

  Common = (function() {

    function Common() {}

    Common.prototype.express = require('express');

    Common.prototype.passport = require('passport');

    Common.prototype.mongoStore = require('connect-mongodb');

    Common.prototype.init = function() {
      this.app = this.express.createServer();
      this.mongourl = process.argv[3] || process.env.NODE_DB || 'mongodb://localhost/laf';
      this.port = process.env.PORT || 9001;
      this.env = process.argv[2] || process.env.NODE_ENV || 'development';
      return this;
    };

    return Common;

  })();

  module.exports = (new Common).init();

}).call(this);
