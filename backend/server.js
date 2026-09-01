/**
 * Main Server Entry Point
 * Express application setup with essential security, parsing middleware,
 * database connection, API routes, and centralized error handling.
 */

// 1. Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Route imports
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');

// Error handling middleware
const errorHandler = require('./middleware/errorHandler');

// 2. Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Connect to MongoDB database
connectDB();

// 4. Core Middlewares
// Enable Helmet for setting security-related HTTP response headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS)
// Allows all origins during development. In production, restrict to your Netlify domain.
app.use(
  cors({
    origin: true,   // Reflects the request origin — allows any origin for local dev
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);



// Enable JSON body parsing for incoming requests
app.use(express.json());

// 5. Routes
// Test / Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API feature routes
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);

// Catch-all 404 handler for undefined API routes
app.use((req, res, next) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// 6. Centralized Error Handler (Must be registered LAST after all routes)
app.use(errorHandler);

// 7. Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 [Server] Backend server running on http://localhost:${PORT}`);
});
