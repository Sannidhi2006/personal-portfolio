/**
 * Project Model Schema
 * Defines the structure for portfolio projects displayed on the website.
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      required: [true, 'Technologies are required'],
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    github_url: {
      type: String,
      default: '',
      trim: true,
    },
    live_url: {
      type: String,
      default: '',
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
