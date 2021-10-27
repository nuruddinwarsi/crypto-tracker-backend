const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  boughtAt: {
    type: Number,
    required: true,
  },
  boughtFrom: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('Crypto', cryptoSchema);
