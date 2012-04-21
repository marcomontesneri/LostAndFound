common = require './../common'
bcrypt = require 'bcrypt'
mongoose = common.mongoose
Schema = mongoose.Schema

cleaningOptions = 
    _id:0,
    password:0

attributes =
    firstName:
        type:String
        required: true
    lastName:
        type:String
        required: true
    email:
        type:String
        required: true
        unique: true
    address: String
    phone:
        type:String
        required: true
    password:
        type:String
        required: true
        set: (password) ->
            bcrypt.hashSync password, bcrypt.genSaltSync 10
    role: String

schema = new Schema attributes, strict: true


schema.methods.comparePassword = (password, callback) ->
        bcrypt.compare(password, this.password, callback)

model = mongoose.model 'User', schema

model.findCleanedOne = (email, callback) ->
    this.findOne
        email:email
        ,cleaningOptions
        ,callback

model.findCleaned = (callback) ->
    this.find
        useless:'filter'
        ,cleaningOptions
        ,callback

module.exports = model