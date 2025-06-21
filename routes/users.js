const router = require('express').Router();
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
        // req.login(registeredUser, (err) => {
        //     if (err) {
        //         return next(err);
        //     }
        //     req.flash('success', 'Welcome to the platform!');
        //     res.redirect('/listings');
        // });
        req.flash('success', 'Registration successful!' + registeredUser.username);
        res.redirect('/listings');
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
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/listings');
});



module.exports = router;