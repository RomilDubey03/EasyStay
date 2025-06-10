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
    images: {
        type: String,
        default: 'https://unsplash.com/photos/buildings-in-a-historic-town-center-Qi_e-n0poRM',
        set : (v) => v == "" ? "default image" : v,
    },
    Country : {
        type: String,
        required: true
    }
});
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;

