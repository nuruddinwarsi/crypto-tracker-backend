const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');

// USER REGISTER
const register = (req, res, next) => {
  const user = req.body;

  if (!user || !user.username || !user.emailId || !user.password) {
    res.status(400).json({
      status: 400,
      message: 'User details missing',
    });
    return;
  }

  User.findOne({ emailId: user.emailId }, (error, userFound) => {
    if (error) throw error;

    // Check if user already exists
    if (userFound) {
      res.status(400).json({
        status: 400,
        message: 'Email ID already taken. Please use a different Email Id',
      });

      return;
    } else {
      // If user doesnt exist, create user
      User.create(user)
        .then((newUser) => {
          // create token for claims
          let claims = {
            userId: newUser._id,
            username: newUser.username,
            emailId: newUser.emailId,
          };

          // get from env variables
          const secret = process.env.JWT_SECRET;
          const expiry = Number(process.env.JWT_EXPIRES_IN);

          // Token creation
          jwt.sign(
            claims,
            secret,
            {
              expiresIn: expiry * 60 * 60, //expiry time in hours
            },
            (error, token) => {
              if (error) {
                // Throw error message
                error.status = 500;
                res.status(500).json({
                  status: 500,
                  mesage: error.message,
                });
                return;
              } else {
                // set http cookie
                res.cookie(
                  'jwt',
                  token,
                  {
                    expires: new Date(
                      Date.now() + process.env.JWT_EXPIRES_IN * 60 * 60 * 1000
                    ),
                  },
                  { signed: true, httpOnly: true }
                );
                // Create new user on success and send as response
                res.status(201).json({
                  status: 201,
                  username: newUser.username,
                  emailId: newUser.emailId,
                  token: token,
                });
              }
            }
          );
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            error.status = 400;
          } else {
            error.status = 500;
          }
          res.status(error.status).json({
            status: error.status,
            message: error.message,
          });

          return;
        });
    }
  });
};

// USER LOGIN
const login = (req, res, next) => {
  const user = req.body;

  if (!user) {
    res.status(401).json({
      status: 401,
      message: 'User details not provided',
    });
    return;
  }

  if (!user.emailId || !user.password) {
    res.status(401).json({
      status: 401,
      message: 'Incorrect email id or password',
    });
    return;
  }

  User.findOne({ emailId: user.emailId }, (error, userFound) => {
    if (error || !userFound) {
      res.status(404).json({
        status: 404,
        message: 'Credentials not found',
      });
      return;
    } else {
      userFound.checkPassword(user.password, (error, isMatch) => {
        if (error || !isMatch) {
          res.status(404).json({
            status: 404,
            message: 'Credentials not found',
          });
          return;
        }

        const claims = {
          userId: userFound._id,
          username: userFound.username,
          emailId: userFound.emailId,
        };

        // get from env variables
        const secret = process.env.JWT_SECRET;
        const expiry = Number(process.env.JWT_EXPIRES_IN);

        jwt.sign(
          claims,
          secret,
          {
            expiresIn: expiry * 60 * 60, //expiry time in hours
          },
          (error, token) => {
            if (error) {
              // Throw error message
              error.status = 500;
              res.status(500).json({
                status: 500,
                mesage: error.message,
              });
              return;
            } else {
              // set http cookie
              res.cookie(
                'jwt',
                token,
                {
                  expires: new Date(Date.now() + expiry * 24 * 60 * 60 * 1000),
                },
                { signed: true, httpOnly: true }
              );
              // Create new user on success and send as response
              res.status(200).json({
                status: 200,
                username: userFound.username,
                emailId: userFound.emailId,
                token: token,
              });
            }
          }
        );
      });
    }
  });
};

module.exports = {
  register,
  login,
};
