const router = require('express').Router({ mergeParams: true });
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');;
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../Schema.js');

// Validation middleware

// Routes
router.get('/', wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render('listing/index.ejs', { listings });
}));

router.get('/new', isLoggedIn, (req, res) => {
  res.render('listing/new.ejs');
});
//post route to create a new listing
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
  console.log("Creating new listing:", req.body.listing); // Debug logging
  const { listing } = req.body;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id; // Set the owner to the current user
  await newListing.save();
  req.flash('success', 'Listing created successfully!');
  res.redirect('/listings');
}));


// Enhanced Search route: supports price queries
router.get('/search', wrapAsync(async (req, res) => {
  const { q } = req.query;
  let listings = [];
  if (q && q.trim() !== "") {
    // If the query is a number, search by price
    if (!isNaN(q)) {
      listings = await Listing.find({ price: { $lte: Number(q) } });
    } else {
      const regex = new RegExp(q, 'i'); // case-insensitive
      listings = await Listing.find({
        $or: [
          { title: regex },
          { location: regex },
          { country: regex }
        ]
      });
    }
  } else {
    listings = await Listing.find({});
  }
  res.render('listing/index.ejs', { listings, searchQuery: q });
}));

router.get('/:id', wrapAsync(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate({ path: 'reviews' , populate: { path: 'author' }})
    .populate('owner'); // Populate owner field with username
  if (!listing) {
    req.flash('error', 'Listing not found or may have been deleted.');
    return res.redirect('/listings');
  }
  res.render('listing/show.ejs', { listing });
}));

//edit route to edit a listing
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
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
  res.redirect(r);
}));

router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    throw new ExpressError('Listing not found', 404);
  }
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
}));

module.exports = router;