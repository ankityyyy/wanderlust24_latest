const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/Expresserror.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");
const { validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//reviews
router.post("/", validateReview, reviewController.reviewCreated);

//delete reviews
router.delete("/:reviewId", wrapAsync(reviewController.reviewDelete));

module.exports = router;
