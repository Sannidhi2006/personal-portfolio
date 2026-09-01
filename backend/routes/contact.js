/**
 * Contact Routes
 * Defines API endpoint for contact message submissions with rate limiting and input validation.
 */

const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { submitMessage } = require('../controllers/contactController');
const { validateContactInput } = require('../middleware/validate');

// Configure rate limiter: max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many messages sent from this IP, please try again after 15 minutes.',
  },
});

// POST /api/contact - Submit contact form message
router.post('/', contactLimiter, validateContactInput, submitMessage);

module.exports = router;
