const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user'); // Import User model
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { sessionConfig } = require('./middleware.js'); // Import session configuration


app.use(session(sessionConfig));
app.use(flash());
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // Use LocalStrategy for authentication
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Basic setup
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));

// Flash middleware to make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user; // Make current user available in all views
  next();
});

// Importing routes
const listingRouter = require('./routes/listings.js');
const reviewsRouter = require('./routes/reviews.js');
const userRouter = require('./routes/users.js');
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);

main()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/easystay');
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