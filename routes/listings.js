const router = require('express').Router({ mergeParams: true });
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');;
const wrapAsync = require('../utils/wrapAsync');
const listingController = require('../Controller/listing.js');

// Routes
router.get('/', wrapAsync(listingController.index));

// Route to get the new listing form
router.get('/new', isLoggedIn, listingController.newForm);

//post route to create a new listing
router.post('/', validateListing, wrapAsync(listingController.create));

// Enhanced Search route: supports price queries
router.get('/search', wrapAsync(listingController.search));

// Route to show a specific listing
router.get('/:id', wrapAsync(listingController.show));

//edit route to edit a listing - Render form
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.editForm));

// Route to update a listing - post request
router.put('/:id', validateListing, wrapAsync(listingController.update));

// Route to delete a listing
router.delete('/:id', isLoggedIn, wrapAsync(listingController.delete));

module.exports = router;