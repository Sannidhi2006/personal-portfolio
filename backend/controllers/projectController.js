/**
 * Project Controller
 * Handles business logic for fetching portfolio projects.
 */

const Project = require('../models/Project');

/**
 * @desc    Get all portfolio projects
 * @route   GET /api/projects
 * @access  Public
 */
const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({ error: 'Failed to read projects from database.' });
  }
};

module.exports = {
  getAllProjects,
};
