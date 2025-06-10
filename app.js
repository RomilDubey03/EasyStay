const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
app.set("view-engine", "ejs");
app.set('views', path.join(__dirname, 'views/listing'));
app.use(express.urlencoded({ extended: true }));


main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/easystay');
}
let port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  }
);

//Index route to render the listings
app.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.render('index.ejs', { listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('Internal Server Error');
  }
});

//create route to render the form for creating a new listing
app.get('/listings/new', (req, res) => {
  res.render('new.ejs');
});

//show route to render a single listing
app.get('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send('Listing not found');
    }
    res.render('show.ejs', { listing });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).send('Internal Server Error');
  }
});


//create route to handle the form submission for creating a new listing
app.post('/listings', async (req, res) => {
  try {
    const { title, description, price, location, images, Country } = req.body;
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      images,
      Country
    });
    await newListing.save();
    res.redirect('/listings');
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).send('Internal Server Error');
  }
});

// app.get('/testListings', (req, res) => {
//     const listing = new Listing({
//         title: 'Test Listing',
//         description: 'This is a test listing.',
//         price: 100,
//         location: 'Test Location',
//         images: '',
//         Country: 'Test Country'
//     });
//     listing.save()
//         .then(() => {
//             console.log('Test listing saved successfully');
//         })
//         .catch(err => {
//             console.error('Error saving test listing:', err);
//         });
//   res.send('OK');
// });

app.get('/', (req, res) => {
  res.send(`Hello, I'm a simple Express server!`);
});