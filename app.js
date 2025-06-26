if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const dbUrl = process.env.ATLASDB_URL;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user"); // Import User model
const passport = require("passport");
const LocalStrategy = require("passport-local");

const MongoStore = require("connect-mongo");
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SESSION_SECRET, // Ensure you have set this environment variable
  },
  touchAfter: 24 * 3600, // time period in seconds
});
const sessionConfig = {
  store: store,
  secret: process.env.SESSION_SECRET, // Ensure you have set this environment variable
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true, // Uncomment if using HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use LocalStrategy for authentication
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Basic setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// Fix for Vercel: use correct root path for views and static files
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Flash middleware to make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // Make current user available in all views
  next();
});
app.get("/", (req, res) => {
  res.redirect("/listings");
});
// Importing routes
const listingRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { error: err.message });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

