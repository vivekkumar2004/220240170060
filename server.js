// server.js

const express = require('express');
const loggerMiddleware = require('./src/middleware/logger');
const allRoutes = require('./src/routes/index');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json()); // JSON body ko parse karne ke liye
app.use(loggerMiddleware); // Custom logger ko har request me add karne ke liye

// Routes
app.use('/', allRoutes);

// 404 Handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Server ko start karna
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});