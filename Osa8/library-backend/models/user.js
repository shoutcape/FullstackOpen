const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 3
  },
  favoriteGenre: {
    type: String,
  }
  ,
})

schema.plugin(uniqueValidator)

module.exports = mongoose.model('User', schema)
