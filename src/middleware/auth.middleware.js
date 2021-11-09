const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization
    : req.cookies.jwt;
  // const token = req.cookies.jwt;
  if (!token) {
    res.status(200).json({
      code: 200,
      status: false,
      message: 'Token missing',
    });

    return;
  }

  const secret = process.env.JWT_SECRET;
  jwt.verify(token, secret, async (error, claims) => {
    if (error) {
      res.status(200).json({
        code: 200,
        status: false,
        message: 'You are not authorized to access this resource.',
      });
      return;
    }

    res.locals.claims = claims;
    next();
  });
};

module.exports = {
  authenticate,
};
