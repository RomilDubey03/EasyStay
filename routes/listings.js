const router = require('express').Router({mergeParams: true});

const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../Schema.js');

// Validation middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        console.log('Validation failed:', msg);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
// Routes
router.get('/', wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render('listing/index.ejs', { listings });
}));

router.get('/new', (req, res) => {
  res.render('listing/new.ejs');
});
//post route to create a new listing
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
  console.log("Creating new listing:", req.body.listing); // Debug logging
  const {listing} = req.body;
  const newListing = new Listing(listing);
  await newListing.save();
  req.flash('success', 'Listing created successfully!');
  res.redirect('/listings');
}));

router.get('/:id', wrapAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate('reviews');
  if (!listing) {
    req.flash('error', 'Listing not found or may have been deleted.');
    return res.redirect('/listings');
  }
  res.render('listing/show.ejs', { listing });
}));
router.get('/:id/edit', wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash('error', 'Listing not found or may have been deleted.');
    return res.redirect('/listings');
  }
  res.render('listing/edit.ejs', { listing });
}));

router.put('/:id', validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
  if (!listing) {
    throw new ExpressError('Listing not found', 404);
  }
  req.flash('success', 'Listing updated successfully!');
  res.redirect(`/listings/${listing._id}`);
}));

router.delete('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    throw new ExpressError('Listing not found', 404);
  }
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
}));

module.exports = router;