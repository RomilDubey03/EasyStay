const mongoose = require('mongoose');
const initData = require('./data'); // Adjust the path as necessary
const Listing = require('../models/listing');
main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/easystay');
}

async function init() {
  try {
    await Listing.deleteMany({}); // Clear existing listings
    await Listing.insertMany(initData.data);
    console.log('Database initialized with test data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

init()
    .then(() => {
        console.log('Initialization complete');
    })
    .catch(err => {
        console.error('Error during initialization:', err);
    });

