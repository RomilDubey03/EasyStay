const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../Schema.js");
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listing/index.ejs", { listings });
};
const Review = require("../models/review");
const User = require("../models/user");

module.exports.search = async (req, res) => {
  const { q } = req.query;
  let listings = [];
  if (q && q.trim() !== "") {
    // If the query is a number, search by price
    if (!isNaN(q)) {
      listings = await Listing.find({ price: { $lte: Number(q) } });
    } else {
      const regex = new RegExp(q, "i"); // case-insensitive
      listings = await Listing.find({
        $or: [{ title: regex }, { location: regex }, { country: regex }],
      });
    }
  } else {
    listings = await Listing.find({});
  }
  res.render("listing/index.ejs", { listings, searchQuery: q });
};

module.exports.show = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "author" } });
  // Populate owner field with username
  if (!listing) {
    req.flash("error", "Listing not found or may have been deleted.");
    return res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing, currUser: req.user });
};

module.exports.newForm = (req, res) => {
  res.render("listing/new.ejs");
};

module.exports.create = async (req, res, next) => {
  const { listing } = req.body;
  const url = req.file.path; // Get the URL from the uploaded file
  const filename = req.file.filename;
  const newListing = new Listing(listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename }; // Set the image field with the URL and filename
  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};

module.exports.editForm = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found or may have been deleted.");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url; // Store the original image URL
  originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_300'); // Store the original image URL
  res.render("listing/edit.ejs", { listing, originalImageUrl});
};

module.exports.update = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(
    id,
    { ...req.body.listing },
    { new: true, runValidators: true }
  );

  if (typeof req.file !== "undefined") {
    const url = req.file.path; // Get the URL from the uploaded file
    const filename = req.file.filename;
    listing.image = { url, filename }; // Set the image field with the URL and filename
  }
  await listing.save();
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.delete = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    throw new ExpressError("Listing not found", 404);
  }
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
