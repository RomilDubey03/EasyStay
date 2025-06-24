const router = require('express').Router();
const { saveRedirectUrl } = require('../middleware');
const passport = require('passport');
const userController = require('../Controller/user.js');
const ExpressError = require('../utils/ExpressError.js');

// get request to render registration form
router.get('/register/new', userController.registerForm);

// Post request to register a new user
router.post('/register', userController.register);

//get request to render login form
router.get('/login', userController.loginForm);

// Login route
router.post('/login', saveRedirectUrl,
    passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), userController.login);

// Logout route
router.get('/logout', userController.logout);


module.exports = router;