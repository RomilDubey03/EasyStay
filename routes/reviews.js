const router = require('express').Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controller/review.js');
const ExpressError = require('../utils/ExpressError.js');

// Create review route
router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.create));

// Delete review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.delete));

module.exports = router;