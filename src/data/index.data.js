require('../models/User');
require('../models/Crypto');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/CrytpTrackerDB');

mongoose.connection.on('connected', () => {
  console.log(`connected`);
});

mongoose.connection.on('error', (error) => {
  console.error(error.message);
});

mongoose.connection.on('disconnect', (error) => {
  console.error(error.message);
});
