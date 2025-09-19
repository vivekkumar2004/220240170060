// src/routes/index.js

const express = require('express');
const router = express.Router();
const { 
  createShortUrl, 
  redirectToOriginalUrl, 
  getUrlStats 
} = require('../controllers/url.controllers.js'); // 👈 check karo file ka exact naam

// Ignore favicon.ico requests
router.get('/favicon.ico', (req, res) => res.sendStatus(204));

// API Routes
router.post('/shorturls', createShortUrl);
router.get('/shorturls/:shortcode', getUrlStats);

// Redirect Route (root level)
router.get('/:shortcode', redirectToOriginalUrl);

// Health check route
router.get('/', (req, res) => 
  res.status(200).send('URL Shortener Service is running!')
);

module.exports = router;
