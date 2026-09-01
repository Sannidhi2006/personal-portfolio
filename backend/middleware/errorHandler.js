/**
 * Centralized Error Handling Middleware
 * Express 4-argument error handler that intercepts all errors,
 * logs them to server console, and returns clean, secure JSON responses.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Log full error details on the server for debugging
  console.error(`💥 [Error Handler] ${req.method} ${req.originalUrl}:`, err);

  let statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = `Resource not found with ID: ${err.value}`;
  }

  // Handle Mongoose Schema Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val) => val.message);
    message = messages.join(', ');
  }

  // Handle JSON parsing errors in body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body.';
  }

  // Send safe JSON response to client without internal stack traces
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;
