const mongoose = require('mongoose');
const cryptoSchema = require('./Crypto');
const bcrypt = require('bcrypt');

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

const saltFactor = Number(process.env.SALT_FACTOR);

userSchema.pre('save', function (done) {
  const user = this;

  // password has not been updated
  if (!user.isModified('password')) {
    return done();
  }

  // password has been updated - hash and save it
  bcrypt.genSalt(saltFactor, (err, salt) => {
    if (err) {
      return done(err);
    }

    bcrypt.hash(user.password, salt, (err, hashedPassword) => {
      if (err) {
        return done(err);
      }

      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

mongoose.model('User', userSchema);
