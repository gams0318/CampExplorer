const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const Campground = require("../models/campground");
const Review = require("../models/review");
const campground = require("../controllers/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
  .route("/")
  .get(catchAsync(campground.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campground.createCampground)
  );
router.get("/new", isLoggedIn, campground.renderNew);

router
  .route("/:id")
  .get(catchAsync(campground.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campground.editCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campground.editForm));

module.exports = router;
