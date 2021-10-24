const mongoose = require('mongoose');
const User = mongoose.model('User');

const register = (req, res, next) => {
  const user = req.body;

  if (!user || !user.username || !user.emailId || !user.password) {
    res.status(400).json({
      status: 400,
      message: 'User details missing',
    });
    return;
  }

  User.findOne({ emailId: user.emailId }, (error, user) => {
    if (error) throw error;

    if (user) {
      res.status(400).json({
        status: 400,
        message: 'Email ID already taken. Please use a different Email Id',
      });

      return;
    } else {
      User.create(user)
        .then((newUser) => {
          const userDetails = {
            username: newUser.username,
            emailId: newUser.emailId,
          };
          res.status(201).json(userDetails);
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

module.exports = {
  register,
};
