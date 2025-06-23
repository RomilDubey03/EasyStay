const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render('listing/index.ejs', { listings });
};

module.exports.search = async (req, res) => {
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
}

module.exports.show = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate({ path: 'reviews' , populate: { path: 'author' }})
    .populate('owner', 'username'); // Populate owner field with username
  if (!listing) {
    req.flash('error', 'Listing not found or may have been deleted.');
    return res.redirect('/listings');
  }
  res.render('listing/show.ejs', { listing, currUser: req.user });
}

module.exports.newForm = (req, res) => {
  res.render('listing/new.ejs');
}

module.exports.create = async (req, res, next) => {
  const { listing } = req.body;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash('success', 'Listing created successfully!');
  res.redirect('/listings');
};

module.exports.editForm = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash('error', 'Listing not found or may have been deleted.');
    return res.redirect('/listings');
  }
  res.render('listing/edit.ejs', { listing });
};

module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
  if (!listing) {
    throw new ExpressError('Listing not found', 404);
  }
  req.flash('success', 'Listing updated successfully!');
  res.redirect(`/listings/${listing._id}`);
};

module.exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    throw new ExpressError('Listing not found', 404);
  }
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
};
