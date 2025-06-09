const express = require('express');
const app = express();

let port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  }
); 

app.get('/', (req, res) => {
  res.send(`Hello, I'm a simple Express server!`);
});