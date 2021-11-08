const mongoose = require('mongoose');
const Crypto = mongoose.model('Crypto');
const User = mongoose.model('User');

const getUserIdFromCookie = (res) => {
  // Get cookie data from auth middleware
  const claims = res.locals;

  if (Object.keys(claims).length === 0) {
    res.status(200).json({
      code: 200,
      status: false,
      message: "You can't access this section before logging in",
    });
    return;
  }

  // Check if userId exists in the cookie data
  const userId = claims.claims.userId;
  if (!userId) {
    res.status(200).json({
      code: 200,
      status: false,
      message: "You can't access this section before logging in",
    });
    return;
  }

  return userId;
};

const getPortfolio = (req, res, next) => {
  const userId = getUserIdFromCookie(res);

  User.findOne({ _id: userId })
    .populate('crypto')
    .exec((err, populatedData) => {
      if (err) {
        res.status(200).json({
          code: 200,
          status: false,
          message: err,
        });
        return;
      } else {
        res.status(200).json({
          code: 200,
          status: true,
          message: 'Portfolio successfully retrieved',
          data: populatedData.crypto,
        });
      }
    });
};

const addToPortfolio = (req, res, next) => {
  const userId = getUserIdFromCookie(res);

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
            res.status(200).json({
              code: 200,
              status: false,
              message: err,
            });
            return;
          } else {
            console.log(result);
            result.crypto.push(cryptoData._id);

            res.status(201).json({
              code: 201,
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
      res.status(200).json({
        code: 200,
        status: false,
        message: error.message,
      });
    });
};

const removeFromPortfolio = (req, res, next) => {
  const userId = getUserIdFromCookie(res);

  const cryptoId = req.params.cryptoId;
  Crypto.deleteOne({ _id: cryptoId }, (err, success) => {
    if (err) {
      res.status(200).json({
        code: 200,
        status: false,
        message: err,
      });
      return;
    } else {
      User.updateOne(
        { _id: userId },
        { $pull: { crypto: cryptoId } },
        { multi: true },
        (error, result) => {
          if (error) {
            res.status(200).json({
              code: 200,
              status: false,
              message: error,
            });
            return;
          }
          res.status(200).json({
            code: 200,
            status: true,
            message: 'Data deleted from portfolio',
            data: result,
          });
        }
      );
    }
  });
};

const getPortfolioSummary = (req, res, next) => {
  // req = coinId, userId
  const userId = getUserIdFromCookie(res);
  let coinId = req.query.coinId;

  if (!coinId) {
    // error handler
    res.status(200).json({
      code: 200,
      status: false,
      message: 'Missing required parameters',
    });
    return;
  }

  coinId = coinId.toUpperCase();

  // get all portfolio data for matching coinId
  User.findOne({ _id: userId })
    .populate({
      path: 'crypto',
      match: {
        coinId: coinId,
      },
    })
    .exec((err, populatedData) => {
      if (err) {
        res.status(200).json({
          code: 200,
          status: false,
          message: err,
        });
        return;
      } else {
        if (populatedData.crypto.length === 0) {
          res.status(200).json({
            code: 200,
            status: false,
            message: `No data found for ${coinId}`,
          });
          return;
        }

        res.status(200).json({
          code: 200,
          status: true,
          message: `Summary for ${coinId} retrieved:`,
          data: populatedData.crypto,
        });
      }
    });
};

module.exports = {
  getPortfolio,
  addToPortfolio,
  removeFromPortfolio,
  getPortfolioSummary,
};
