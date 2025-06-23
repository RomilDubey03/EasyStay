const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    country: {
        type: String,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});
//middleware to delete associated reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async function (listing) {
    if (listing) {
        const Review = require('./review'); // Import Review model
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;

