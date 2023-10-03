const User = require('../../model/UserSchema');
const passport = require('passport');
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken');

const CLIENT_URL = "http://localhost:3000/home";
const SecretKey = "wbsakjfveshgv@qwhj";

const login = async (req, res, next) => {
  try {
    const googleProfile = req.user;

    // Check if the user already exists in your MongoDB by their email
    const existingUser = await User.findOne({ email: googleProfile.emails[0].value });

    if (!existingUser) {
      // User doesn't exist, so create a new user
      const hashedPassword = await bcrypt.hash(googleProfile.id, 10); // Hash the Google ID (you can customize this)

      const newUser = new User({
        Name: googleProfile.displayName,
        email: googleProfile.emails[0].value,
        ProfilePic: googleProfile.photos[0].value,
        password: hashedPassword,
      });

      await newUser.save();

      let token = jwt.sign(
        {
          UserId: newUser.id,
          Name: newUser.Name,
          email: newUser.email,
        },
        SecretKey,
        { expiresIn: '2h' }
      );

      res.status(201).json({
        status: 'Success',
        message: 'You Have Successfully Logged in',
        data: newUser,
        token: token,
      });
    } else {
      let token = jwt.sign(
        {
          UserId: existingUser.id,
          Name: existingUser.Name,
          email: existingUser.email,
        },
        SecretKey,
        { expiresIn: '2h' }
      );

      res.status(201).json({
        status: 'Success',
        message: 'You Have Successfully Logged in',
        data: existingUser,
        token: token,
      });
    }
  } catch (err) {
    res.status(501).json({
      status: 'fail',
      HowToCreateUsreSignup: req.requestTime,
      data: {
        err,
      },
    });
  }
};

const logifailed = (req, res, next) => {
  res.status(401).json({
    success: false,
    message: 'Authentication failure',
  });
};

module.exports.login = login;
module.exports.logifailed = logifailed;
