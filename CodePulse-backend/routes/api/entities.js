const express = require('express');
const router = express.Router();
const {
  getEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
  generateEntities
} = require('../../controllers/entityController');
const auth = require('../../middleware/auth');

// @route   GET /api/entities/:projectId
// @desc    Get all entities for a project
// @access  Private
router.get('/:projectId', auth, getEntities);

// @route   GET /api/entities/:projectId/:id
// @desc    Get single entity
// @access  Private
router.get('/:projectId/:id', auth, getEntity);

// @route   POST /api/entities/:projectId
// @desc    Create an entity
// @access  Private
router.post('/:projectId', auth, createEntity);

// @route   PUT /api/entities/:projectId/:id
// @desc    Update an entity
// @access  Private
router.put('/:projectId/:id', auth, updateEntity);

// @route   DELETE /api/entities/:projectId/:id
// @desc    Delete an entity
// @access  Private
router.delete('/:projectId/:id', auth, deleteEntity);

// @route   POST /api/entities/generate/:projectId
// @desc    Generate entities for a project
// @access  Private
router.post('/generate/:projectId', auth, generateEntities);

module.exports = router;