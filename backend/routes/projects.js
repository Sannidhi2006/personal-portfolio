/**
 * Project Routes
 * Defines API endpoints for retrieving project data.
 */

const express = require('express');
const router = express.Router();
const { getAllProjects, getProjectById } = require('../controllers/projectController');

// GET /api/projects - Retrieve all projects
router.get('/', getAllProjects);

// GET /api/projects/:id - Retrieve a single project by ID
router.get('/:id', getProjectById);

module.exports = router;
