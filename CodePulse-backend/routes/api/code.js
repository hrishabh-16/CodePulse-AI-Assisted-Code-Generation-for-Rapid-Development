const express = require('express');
const router = express.Router();
const {
  generateCode,
  downloadProject,
  getGeneratedCode
} = require('../../controllers/codeGenerationController');
const auth = require('../../middleware/auth');

// @route   POST /api/code/:projectId
// @desc    Generate code for a project
// @access  Private
router.post('/:projectId', auth, generateCode);

// @route   GET /api/code/:projectId
// @desc    Get generated code for a project
// @access  Private
router.get('/:projectId', auth, getGeneratedCode);

// @route   GET /api/code/:projectId/download
// @desc    Download project as ZIP
// @access  Private
router.get('/:projectId/download', auth, downloadProject);

module.exports = router;