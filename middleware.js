
const listingSchema = require('./models/listing.js');
const currUser = require('./models/user.js');   
const mongoose = require('mongoose');

module.exports.isLoggedIn = (req, res, next) => {
    //console.log(req);
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to do that!');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = (req, res, next) => {
    const { id } = req.params;
    let listing = listingSchema.findById(id);
    if(!(listing.owner.id.equals(res.locals.currUser._id))){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
};