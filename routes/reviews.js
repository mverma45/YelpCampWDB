const express = require('express');
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
// const campgrounds = require('../routes/campgrounds');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utils/ExpressError');
// const reviews = require('../routes/reviews');
const catchAsync = require('../utils/catchAsync');

//Create Review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview)
);

 //Delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

// we need the /:id and the :reviewId because we want to remove the reference in the campground and the review it self.

module.exports = router;