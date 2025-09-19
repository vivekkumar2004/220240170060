// src/middleware/logger.js

const loggerMiddleware = (req, res, next) => {
  // Yeh logger request object me 'log' function add kar dega.
  req.log = {
    info: (message) => {
      console.log(`[INFO] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${message}`);
    },
    error: (message) => {
      console.error(`[ERROR] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${message}`);
    },
  };
  next();
};

module.exports = loggerMiddleware;