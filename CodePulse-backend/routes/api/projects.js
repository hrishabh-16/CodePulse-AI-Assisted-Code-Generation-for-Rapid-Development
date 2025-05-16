const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectTechStack
} = require('../../controllers/projectController');
const auth = require('../../middleware/auth');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', auth, getProjects);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', auth, getProject);

// @route   POST /api/projects
// @desc    Create a project
// @access  Private
router.post('/', auth, createProject);

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, deleteProject);

// @route   PUT /api/projects/:id/tech
// @desc    Update project tech stack
// @access  Private
router.put('/:id/tech', auth, updateProjectTechStack);

module.exports = router;