/**
 * Contact Controller
 * Handles incoming contact form messages.
 */

const mongoose = require('mongoose');
const Message = require('../models/Message');

// In-memory storage for offline development messages
const offlineMessages = [];

/**
 * @desc    Submit a new contact message
 * @route   POST /api/contact
 * @access  Public
 */
const submitMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // If connected to MongoDB, persist to database
    if (mongoose.connection.readyState === 1) {
      const newMessage = await Message.create({
        name,
        email,
        message,
      });

      return res.status(201).json({
        success: true,
        message: 'Message received',
        data: {
          id: newMessage._id,
          name: newMessage.name,
          email: newMessage.email,
          createdAt: newMessage.createdAt,
        },
      });
    }

    // Offline / Standalone development fallback
    const mockMessage = {
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      message,
      createdAt: new Date(),
    };
    offlineMessages.push(mockMessage);
    console.log(`📩 [Contact Message - Offline Mode] From: ${name} <${email}>, Message: "${message}"`);

    return res.status(201).json({
      success: true,
      message: 'Message received',
      data: {
        id: mockMessage._id,
        name: mockMessage.name,
        email: mockMessage.email,
        createdAt: mockMessage.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitMessage,
  offlineMessages,
};
