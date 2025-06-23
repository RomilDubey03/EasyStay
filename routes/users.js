const router = require('express').Router();
const { saveRedirectUrl, isLoggedIn } = require('../middleware');
const User = require('../models/user');
const passport = require('passport');


// Render registration form
router.get('/register/new', (req, res) => {
    res.render('users/register.ejs');
});

router.post('/register', async (req, res) => {
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
});

//get request to render login form
router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

// Login route
router.post('/login', saveRedirectUrl,
    passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    // console.log('Redirect URL:', req.session.redirectUrl); 
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
});

// Logout route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/listings');
    })
});


module.exports = router;