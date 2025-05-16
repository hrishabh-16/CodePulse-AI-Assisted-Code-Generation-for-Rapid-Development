const express = require('express');
const router = express.Router();
const {
  getTechOptions,
  updateTechStack
} = require('../../controllers/techController');
const auth = require('../../middleware/auth');

// @route   GET /api/tech/options
// @desc    Get all tech stack options
// @access  Public
router.get('/options', getTechOptions);

// @route   PUT /api/tech/:projectId
// @desc    Update project tech stack
// @access  Private
router.put('/:projectId', auth, updateTechStack);

module.exports = router;