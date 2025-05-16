const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./api/auth');
const projectRoutes = require('./api/projects');
const entityRoutes = require('./api/entities');
const techRoutes = require('./api/tech');
const structureRoutes = require('./api/structure');
const codeRoutes = require('./api/code');

// Mount routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/entities', entityRoutes);
router.use('/tech', techRoutes);
router.use('/structure', structureRoutes);
router.use('/code', codeRoutes);

module.exports = router;