const router = require('express').Router();
const UserController = require('../Controllers/UserControllers/UserControllers');
const passport = require('passport');
const User = require('../model/UserSchema');
const CLIENT_URL = "http://localhost:3000/home";

// Handle successful login
router.route('/login/success').get(UserController.login);

// Handle failed login
router.route('/login/failed').get(UserController.logifailed);

// Logout route
router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("http://localhost:3000/login");
});

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback route after successful Google authentication
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: CLIENT_URL,
  failureRedirect: "/login/failed",
}));

// Define a new GET endpoint to retrieve user information by ID
router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query the database to find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      // If the user with the specified ID doesn't exist, return a 404 response
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If the user is found, return their information
    res.status(200).json({
      success: true,
      message: 'User information retrieved successfully',
      data: user,
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
});

module.exports = router;
