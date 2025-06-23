const router = require('express').Router({ mergeParams: true });
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../Schema.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');


// Middleware to ensure user is logged in
// router.use(isLoggedIn);




// Review Routes
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError('Listing not found', 404);
    }
    const review = new Review(req.body.review);
    review.author = req.user._id; // Set the author of the review to the current user
    listing.reviews.push(review); // Make sure to add reviews array to Listing model
    
    await review.save();
    await listing.save();
    req.flash('success', 'Review created successfully!');
    res.redirect(`/listings/${listing._id}`);
}));

// Delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });
    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;