const User = require('../models/user');
const passport = require('passport');

// Render registration form
module.exports.registerForm = (req, res) => {
  res.render('users/register.ejs');
};

// Register a new user and log them in
module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // Automatically log in the user after registration
    req.login(registeredUser, (err) => {
      if (err) {
        req.flash('error', 'Login failed after registration.');
        return res.redirect('/users/register/new');
      } else {
        req.flash('success', 'Registration successful! Welcome to EasyStay' + registeredUser.username);
        res.redirect('/listings');
      }
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/users/register/new');
  }
};

// Render login form
module.exports.loginForm = (req, res) => {
  res.render('users/login.ejs');
};

// Log in a user and redirect
module.exports.login = (req, res) => {
  req.flash('success', 'Welcome back!');
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

// Log out a user
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logged out successfully!');
    res.redirect('/listings');
  });
};
