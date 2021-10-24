require('../models/User');
require('../models/Crypto');

const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
  // Connect to local db using env config
  const DB = process.env.DATABASE_LOCAL;
  mongoose.connect(DB);
} else {
  // IF env is PRODUCTION
  // Connect to atlas cluster db using env config
  const DB = process.env.DATABASE_ATLAS.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );
  mongoose.connect(DB);
}

mongoose.connection.on('connected', () => {
  console.log(`ENV : ${process.env.NODE_ENV}`);
  console.log(`Connected ✅`);
});

mongoose.connection.on('error', (error) => {
  console.error(`💥 ${error.message}`);
});

mongoose.connection.on('disconnect', (error) => {
  console.error(`💥 ${error.message}`);
});
