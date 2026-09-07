/**
 * Contact Controller
 * Handles incoming contact form messages, persists them to database/memory,
 * and dispatches notification emails to owner and confirmation to sender.
 */

const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Message = require('../models/Message');

// In-memory storage for offline / fallback messages
const offlineMessages = [];

/**
 * Configure Nodemailer Transporter
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);

  if (user && pass) {
    return nodemailer.createTransport({
      service: host.includes('gmail') ? 'gmail' : undefined,
      host: host.includes('gmail') ? undefined : host,
      port: host.includes('gmail') ? undefined : port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return null;
};

/**
 * Send notification email to owner and auto-reply confirmation to sender
 */
const sendEmails = async ({ name, email, message }) => {
  const transporter = createTransporter();
  const ownerEmail = process.env.RECIPIENT_EMAIL || 'kamathshinnu555@gmail.com';

  if (transporter) {
    try {
      // 1. Email to Portfolio Owner
      const ownerMailPromise = transporter.sendMail({
        from: `"${name} (Portfolio Contact)" <${process.env.EMAIL_USER || ownerEmail}>`,
        replyTo: email,
        to: ownerEmail,
        subject: `🚀 New Portfolio Message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
            <h2 style="color: #ff2d87; margin-top: 0;">New Contact Form Submission</h2>
            <p style="color: #94a3b8; font-size: 14px;">You have received a new message via your portfolio website.</p>
            <hr style="border: 0; border-top: 1px solid #334155; margin: 16px 0;" />
            <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
              <p style="margin: 0 0 8px 0;"><strong>Sender Name:</strong> <span style="color: #38bdf8;">${name}</span></p>
              <p style="margin: 0 0 8px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #a855f7;">${email}</a></p>
              <p style="margin: 0;"><strong>Date:</strong> <span style="color: #94a3b8;">${new Date().toLocaleString()}</span></p>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px;">
              <h4 style="margin: 0 0 8px 0; color: #34d399;">Message:</h4>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
          </div>
        `,
      });

      // 2. Auto-reply confirmation to the sender's entered email
      const senderMailPromise = transporter.sendMail({
        from: `"Sannidhi Naveen Kamath" <${process.env.EMAIL_USER || ownerEmail}>`,
        to: email,
        subject: `✨ Message Received! Thank you for reaching out, ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #334155;">
            <h2 style="color: #ff2d87; margin-top: 0;">Thank You for Connecting!</h2>
            <p style="color: #e2e8f0; font-size: 15px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              Thank you for reaching out through my portfolio website! I have received your message and will get back to you as soon as possible.
            </p>
            <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ff2d87;">
              <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em;">Your Message Copy:</p>
              <p style="margin: 0; white-space: pre-wrap; color: #f1f5f9; font-style: italic;">"${message}"</p>
            </div>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 20px;">
              Best regards,<br/>
              <strong style="color: #f8fafc;">Sannidhi Naveen Kamath</strong><br/>
              Creative Developer &amp; Tech Enthusiast<br/>
              <a href="mailto:${ownerEmail}" style="color: #38bdf8;">${ownerEmail}</a> | <a href="tel:+918431100137" style="color: #38bdf8;">+91 8431100137</a>
            </p>
          </div>
        `,
      });

      await Promise.all([ownerMailPromise, senderMailPromise]);
      console.log(`✉️ [Email Service] Successfully dispatched emails via Nodemailer to owner (${ownerEmail}) and sender (${email})`);
      return { sent: true };
    } catch (emailErr) {
      console.warn('⚠️ [Email Service] Nodemailer failed, falling back to cloud email service:', emailErr.message);
    }
  }

  // Fallback cloud delivery via FormSubmit HTTP API
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${ownerEmail}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `🚀 Portfolio Message from ${name}`,
        _replyto: email,
        _template: 'table',
        _captcha: 'false',
        _autoresponse: `Hi ${name},\n\nThank you for reaching out through my portfolio website! I have received your message:\n\n"${message}"\n\nI will review it and get back to you shortly.\n\nBest regards,\nSannidhi Naveen Kamath\nCreative Developer & Tech Enthusiast\nEmail: kamathshinnu555@gmail.com`
      })
    });
    if (res.ok) {
      console.log(`✉️ [Email Service] Successfully dispatched message to ${ownerEmail} and auto-reply to ${email}`);
      return { sent: true };
    }
  } catch (cloudErr) {
    console.warn('⚠️ [Email Service] Cloud email delivery attempt failed:', cloudErr.message);
  }

  return { sent: false, reason: 'Stored in database' };
};

/**
 * @desc    Submit a new contact message
 * @route   POST /api/contact
 * @access  Public
 */
const submitMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    let savedData = null;

    // Persist to MongoDB if available
    if (mongoose.connection.readyState === 1) {
      try {
        const newMessage = await Message.create({ name, email, message });
        savedData = {
          id: newMessage._id,
          name: newMessage.name,
          email: newMessage.email,
          createdAt: newMessage.createdAt,
        };
      } catch (dbErr) {
        console.warn('⚠️ [Contact Controller] MongoDB write failed, continuing with in-memory fallback:', dbErr.message);
      }
    }

    // Fallback if not saved to MongoDB
    if (!savedData) {
      const mockMessage = {
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        message,
        createdAt: new Date(),
      };
      offlineMessages.push(mockMessage);
      savedData = {
        id: mockMessage._id,
        name: mockMessage.name,
        email: mockMessage.email,
        createdAt: mockMessage.createdAt,
      };
    }

    console.log(`📩 [Contact Message] From: ${name} <${email}>, Message: "${message}"`);

    // Dispatch emails (asynchronous non-blocking)
    sendEmails({ name, email, message }).catch((err) => {
      console.error('Email sending error:', err);
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! A confirmation has been dispatched to your email.',
      data: savedData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitMessage,
  offlineMessages,
};

