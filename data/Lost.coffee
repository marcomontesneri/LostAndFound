common = require './../common'
mongoose = common.mongoose
Schema = mongoose.Schema


attributes =
    shortDesc: String
    lostOn: Date
    declaredOn: Date
    where: String
    owner: String
    category: String
    fields: [
        label: String
        value: String
    ]

schema = new Schema attributes, strict: true


model = mongoose.model 'Lost', schema

module.exports = model