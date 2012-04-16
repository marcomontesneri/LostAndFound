/*
 * Dependencies
 */
var mongoose = require('mongoose'),
    sha1 = require('sha1');

function Data() {
    this.mongoose = mongoose;
}

Data.prototype.connect = function(mongourl) {
    this.mongoose.connect(mongourl);
};

Data.prototype.saltySha1 = function(v) {
    return sha1('unicorns' + v + 'AreAwesome');
};

var Schema = mongoose.Schema;

Data.prototype.User = mongoose.model('User', new Schema({
    firstName:  {
        type:String,
        required: true,
    },
    lastName: {
        type:String,
        required: true,
    },
    email: {
        type:String,
        required: true,
        unique: true
    },
    address: String,
    phone: {
        type:String,
        required: true,
    },
    password:  {
        type:String,
        required: true,
        set: Data.prototype.saltySha1
    },
    role: String
},{strict: true}));

Data.prototype.Category = mongoose.model('Category', new Schema({
    label: String,
    fields: [String]
}));

Data.prototype.Storage = mongoose.model('Storage', new Schema({
    desc: String,
    state: String
}));
Data.prototype.Lost = mongoose.model('Lost', new Schema({
    shortDesc: String,
    lostOn: Date,
    declaredOn: Date,
    where: String,
    owner: String,
    category: String,
    fields: [{
        label: String,
        value: String
    }]
}));
Data.prototype.Found = mongoose.model('Found', new Schema({
    shortDesc: String,
    foundOn: Date,
    broughtOn: Date,
    where: String
}));

module.exports = new Data();