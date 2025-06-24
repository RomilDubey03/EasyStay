const router = require('express').Router({ mergeParams: true });
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');;
const wrapAsync = require('../utils/wrapAsync');
const listingController = require('../Controller/listing.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js'); // Import cloudinary storage
const upload = multer({ storage: storage }); // Use cloudinary storage




// Routes
router.get('/', wrapAsync(listingController.index));

// Route to get the new listing form
router.get('/new', listingController.newForm);

//post route to create a new listing
router.post('/', isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.create));

// Enhanced Search route: supports price queries
router.get('/search', wrapAsync(listingController.search));

// Route to show a specific listing
router.get('/:id', wrapAsync(listingController.show));

//edit route to edit a listing - Render form
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.editForm));

// Route to update a listing - post request
router.put('/:id',upload.single('listing[image]'), validateListing, wrapAsync(listingController.update));

// Route to delete a listing
router.delete('/:id', isLoggedIn, wrapAsync(listingController.delete));

module.exports = router;