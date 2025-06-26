// api/listings.js
const path = require("path");
// make sure all `require(...)` calls inside app.js find the right files:
process.chdir(path.resolve(__dirname, ".."));

const app = require("../app");   // pull in your app.js
module.exports = app;            // export it as the Serverless Function
