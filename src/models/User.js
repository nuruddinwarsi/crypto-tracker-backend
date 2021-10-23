const mongoose = require('mongoose');
const cryptoSchema = require('./Crypto');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // crypto: {
  //   type: cryptoSchema,
  //   _id: false,
  // },
});

mongoose.model('User', userSchema);
