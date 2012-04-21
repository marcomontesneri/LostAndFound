common = require './../common'
mongoose = common.mongoose
Schema = mongoose.Schema


attributes =
    shortDesc: String
    foundOn: Date
    broughtOn: Date
    where: String

schema = new Schema attributes, strict: true

model = mongoose.model 'Found', schema

module.exports = model