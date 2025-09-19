// src/services/store.js

// Hum do objects ka istemal karenge URLs aur unke clicks ko store karne ke liye.
// Real-world application mein, yahaan MongoDB ya PostgreSQL ka connection hoga.

const urls = new Map(); // shortcode -> { originalUrl, createdAt, expiresAt }
const clicks = new Map(); // shortcode -> [ { clickedAt, referrer, ip } ]

module.exports = {
  urls,
  clicks,
};