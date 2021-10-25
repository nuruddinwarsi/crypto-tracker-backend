const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Crypto = require('./Crypto');

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
  crypto: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Crypto',
      // _id: false,
    },
  ],
});

// Email ID validator
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
userSchema
  .path('emailId')
  .validate((emailId) => emailRegex.test(emailId), 'Invalid email id format');

// Password validator
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
userSchema
  .path('password')
  .validate(
    (password) => passwordRegex.test(password),
    'Password must contain at least 1 lowercase, 1 uppercase , 1 numeric  and one special character'
  );

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
