/**
 * Input Validation Middleware
 * Validates incoming request payloads before reaching controllers.
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Middleware to validate contact form submissions
 */
const validateContactInput = (req, res, next) => {
  const { name, email, message } = req.body || {};

  // Check required name field
  if (!name || typeof name !== 'string' || name.trim() === '') {
    const error = new Error('Name is required and must be non-empty.');
    error.statusCode = 400;
    return next(error);
  }

  if (name.trim().length > 100) {
    const error = new Error('Name must not exceed 100 characters.');
    error.statusCode = 400;
    return next(error);
  }

  // Check required email field
  if (!email || typeof email !== 'string' || email.trim() === '') {
    const error = new Error('Email is required and must be non-empty.');
    error.statusCode = 400;
    return next(error);
  }

  if (!emailRegex.test(email.trim())) {
    const error = new Error('Please provide a valid email address.');
    error.statusCode = 400;
    return next(error);
  }

  // Check required message field
  if (!message || typeof message !== 'string' || message.trim() === '') {
    const error = new Error('Message is required and must be non-empty.');
    error.statusCode = 400;
    return next(error);
  }

  if (message.trim().length > 2000) {
    const error = new Error('Message must not exceed 2000 characters.');
    error.statusCode = 400;
    return next(error);
  }

  // Sanitize trimmed values onto req.body
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.message = message.trim();

  next();
};

module.exports = {
  validateContactInput,
};
