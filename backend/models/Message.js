/**
 * Message Model Schema
 * Defines the structure for contact form submissions.
 */

const mongoose = require('mongoose');

// Standard email validation regular expression
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Sender email is required'],
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Please provide a valid email address'],
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
