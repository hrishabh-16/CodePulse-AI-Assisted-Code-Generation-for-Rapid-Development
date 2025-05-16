const express = require('express');
const router = express.Router();
const {
  generateFolderStructure
} = require('../../controllers/codeGenerationController');
const auth = require('../../middleware/auth');

// @route   POST /api/structure/:projectId
// @desc    Generate folder structure for a project
// @access  Private
router.post('/:projectId', auth, generateFolderStructure);

module.exports = router;