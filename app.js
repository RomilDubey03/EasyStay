const express = require('express');
const app = express();
const mongoose = require('mongoose');

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/EasyStay');
}
let port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  }
); 

app.get('/', (req, res) => {
  res.send(`Hello, I'm a simple Express server!`);
});