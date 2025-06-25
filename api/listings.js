const app = require('../app');

// Vercel expects a function handler: (req, res) => {}
module.exports = (req, res) => {
  app(req, res);
};