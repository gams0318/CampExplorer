const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { campgroundSchema, reviewSchema } = require('../schemas')
const { isLoggedIn, isReviewAuthor } = require('../middleware')
const { storeReturnTo } = require('../middleware')
const reviews = require('../controllers/reviews')
// const validateReview = (req, res, next) => {

//     const { error } = reviewSchema.validate(req.body);
//     // console.log(result)
//     if (error) {
//         console.log(error)
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     }
//     else next();

// }

router.post('/', isLoggedIn, catchAsync(reviews.addReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))
module.exports = router;