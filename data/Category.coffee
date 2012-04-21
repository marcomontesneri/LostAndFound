common = require './../common'
mongoose = common.mongoose
Schema = mongoose.Schema


attributes =
    label: String
    fields: [String]

schema = new Schema attributes, strict: true


model = mongoose.model 'Category', schema

module.exports = model