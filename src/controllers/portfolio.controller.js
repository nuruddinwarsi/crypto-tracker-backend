const mongoose = require('mongoose');
const Crypto = mongoose.model('Crypto');
const User = mongoose.model('User');

const getPortfolio = (req, res, next) => {
  const claims = res.locals;
  res.send(claims);
};

const addToPortfolio = (req, res, next) => {
  // Get cookie data from auth middleware
  const claims = res.locals;
  if (Object.keys(claims).length === 0) {
    res.status(401).json({
      status: false,
      message: 'You cant access this section before logging in',
    });
    return;
  }

  // Check if userId exists in the cookie data
  const userId = claims.claims.userId;
  if (!userId) {
    res.status(401).json({
      status: false,
      message: 'You cant access this section before logging in',
    });
    return;
  }

  // Get request body data
  const cryptoRequest = req.body;

  // Create new cryptodata and add to user model
  Crypto.create(cryptoRequest)
    .then((cryptoData) => {
      User.findByIdAndUpdate(
        userId,
        { $push: { crypto: cryptoData._id } },
        (err, result) => {
          if (err) {
            res.status(401).json({
              status: false,
              message: err,
            });
            return;
          } else {
            result.crypto.push(cryptoData._id);

            res.status(201).json({
              status: true,
              messagae: 'Crypto data added to portfolio',
              data: cryptoData,
              portfolioCrypto: result.crypto,
            });
          }
        }
      );
    })
    .catch((error) => {
      res.status(error.status).json({
        status: false,
        message: error.message,
      });
    });
};

module.exports = { getPortfolio, addToPortfolio };
