if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Using callback
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const joi = require("joi");
const ejsMate = require("ejs-mate");
app.use(morgan("tiny"));
const path = require("path");
const session = require("express-session");
const { mongoStore } = require("connect-mongo");
const mongoDBStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const dbURL = "mongodb://127.0.0.1:27017/CampExplorer";
const ExpressError = require("./utilities/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");
const catchAsync = require("./utilities/catchAsync");
const campgroundRoutes = require("./routes/campground");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");

const flash = require("connect-flash");
mongoose.connect(dbURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const { campgroundSchema, reviewSchema } = require("./schemas");

const store = new mongoDBStore({
  url: dbURL,
  secret: "thisisasecret",
  touchAfter: 24 * 3600,
});
store.on("error", function (e) {
  console.log("session store error", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret: "thisissecret",
  resave: false,
  saveUninitialized: true,

  cookie: {
    httpOnly: true,
    expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(flash());
app.use(session(sessionConfig));
app.use(express.urlencoded({ express: true }));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.render("home");
});

app.use(express.static(path.join(__dirname, "public")));
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get(
  "/makecampground",
  catchAsync(async (req, res) => {
    const camp = new Campground({
      title: "My Backyard",
      description: "Cheap camping",
    });
    await camp.save();
  })
);

app.get("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("listening at post 3000");
});

//hFFWtClp6WWBWh0M
