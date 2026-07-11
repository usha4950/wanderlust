const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isreviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


// Post review
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.CreateReviewes)
);

// Delete review
router.delete(
    "/:reviewId",
    isLoggedIn,
    isreviewAuthor,
    wrapAsync(reviewController.DeleteReviewse)
);

module.exports = router;