// src/controllers/url.controller.js

const { urls, clicks } = require('../services/store');
const { nanoid } = require('nanoid');
const { addMinutes, formatISO } = require('date-fns');

// Endpoint 1: Short URL banana
const createShortUrl = async (req, res) => {
  const { url: originalUrl, validity, shortcode: customShortcode } = req.body;

  // URL validation
  if (!originalUrl || !/^(ftp|http|https):\/\/[^ "]+$/.test(originalUrl)) {
    req.log.error('Invalid URL provided');
    return res.status(400).json({ error: 'A valid URL must be provided.' });
  }

  try {
    let shortcode = customShortcode;

    // Agar custom shortcode diya hai to check karo ki available hai ya nahi
    if (shortcode) {
      if (urls.has(shortcode)) {
        req.log.error(`Shortcode collision for: ${shortcode}`);
        return res.status(409).json({ error: `Shortcode '${shortcode}' is already in use.` });
      }
    } else {
      // Agar nahi diya to naya unique shortcode generate karo
      shortcode = nanoid(7);
      while (urls.has(shortcode)) {
        shortcode = nanoid(7);
      }
    }

    const createdAt = new Date();
    const validityMinutes = validity ? parseInt(validity, 10) : 30; // Default 30 minutes
    const expiresAt = addMinutes(createdAt, validityMinutes);

    const newUrlEntry = {
      originalUrl,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    urls.set(shortcode, newUrlEntry);
    req.log.info(`URL shortened: ${shortcode} -> ${originalUrl}`);

    const shortLink = `http://${req.get('host')}/${shortcode}`;

    return res.status(201).json({
      shortLink,
      expiry: formatISO(expiresAt),
    });
  } catch (error) {
    req.log.error(`Server error during URL creation: ${error.message}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Endpoint 2: Redirect karna
const redirectToOriginalUrl = (req, res) => {
  const { shortcode } = req.params;
  const urlEntry = urls.get(shortcode);

  if (!urlEntry) {
    req.log.error(`Shortcode not found: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  // Expiry check
  if (new Date() > new Date(urlEntry.expiresAt)) {
    req.log.error(`Expired shortcode accessed: ${shortcode}`);
    return res.status(410).json({ error: 'This link has expired.' });
  }

  // Click ko log karna (asynchronously)
  const clickData = {
    clickedAt: new Date().toISOString(),
    referrer: req.get('Referrer') || 'Direct',
    ip: req.ip,
  };
  
  const existingClicks = clicks.get(shortcode) || [];
  clicks.set(shortcode, [...existingClicks, clickData]);
  
  req.log.info(`Redirecting ${shortcode} to ${urlEntry.originalUrl}`);
  
  // Agar Postman se request aayi ho to JSON message bhejo
  const userAgent = req.headers['user-agent'] || '';
  if (userAgent.includes('Postman')) {
    return res.json({
      message: "Redirecting...",
      originalUrl: urlEntry.originalUrl
    });
  }

  // Browser me redirect karo
  return res.redirect(302, urlEntry.originalUrl);
};

// Endpoint 3: Statistics get karna
const getUrlStats = (req, res) => {
  const { shortcode } = req.params;
  const urlEntry = urls.get(shortcode);

  if (!urlEntry) {
    req.log.error(`Stats requested for non-existent shortcode: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  const clickData = clicks.get(shortcode) || [];

  const response = {
    totalClicks: clickData.length,
    originalUrl: urlEntry.originalUrl,
    creationDate: urlEntry.createdAt,
    expiryDate: urlEntry.expiresAt,
    detailedClicks: clickData,
  };

  req.log.info(`Stats returned for shortcode: ${shortcode}`);
  return res.status(200).json(response);
};

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlStats,
};
