const mongoose = require('mongoose');
const Listing = require('../models/listing');
const Review = require('../models/review');
const User = require('../models/user');
const { data } = require('./data');

mongoose.connect('mongodb://127.0.0.1:27017/easystay', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleComments = [
  "Absolutely loved our stay! The host was incredibly welcoming and the property was spotless. The view from the balcony was breathtaking and we enjoyed every moment. Highly recommended for anyone looking for a peaceful retreat.",
  "This was one of the best travel experiences we've ever had. The amenities were top-notch, the location was perfect, and the host went above and beyond to make sure we were comfortable. Will definitely book again!",
  "A wonderful place to relax and unwind. The house was beautifully decorated and had everything we needed. The surrounding area was quiet and scenic, making it a perfect getaway from the city.",
  "Our family had an amazing time here. The kids loved the spacious backyard and we appreciated the fully equipped kitchen. The host provided great local recommendations and was always available for questions."
];

const sampleRatings = [5, 4, 5, 4];

async function seedDB() {
  await Listing.deleteMany({});
  await Review.deleteMany({});

  const users = await User.find({});
  if (users.length < 4) {
    throw new Error('Not enough users in the database to assign reviews.');
  }

  for (let listingData of data) {
    const listing = new Listing(listingData);
    // Create 4 reviews for each listing, each from a different user
    for (let i = 0; i < 4; i++) {
      const user = users[i % users.length];
      const review = new Review({
        comment: sampleComments[i % sampleComments.length],
        rating: sampleRatings[i % sampleRatings.length],
        author: user._id,
        createdAt: new Date()
      });
      await review.save();
      listing.reviews.push(review);
    }
    await listing.save();
  }
  console.log('Database seeded with listings and 4 long reviews per listing!');
  mongoose.connection.close();
}

seedDB().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
