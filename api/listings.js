// api/listings.js
const path = require("path");
process.chdir(path.resolve(__dirname, ".."));

const app = require("../app");   // your Express instance from app.js
module.exports = app;
