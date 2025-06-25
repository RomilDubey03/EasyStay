const router = require("express").Router({ mergeParams: true });
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync");
const listingController = require("../Controller/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // Import cloudinary storage
const upload = multer({ storage: storage }); // Use cloudinary storage

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.create)
  );

  // Route to get the new listing form
router.get("/new", isLoggedIn, listingController.newForm);

// Enhanced Search route: supports price queries
router.get("/search", wrapAsync(listingController.search));

router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete));





//edit route to edit a listing - Render form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm)
);

module.exports = router;
