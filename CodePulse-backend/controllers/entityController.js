const Entity = require('../models/Entity');
const Project = require('../models/Project');
const asyncHandler = require('../middleware/async');
const aiService = require('../services/aiService');

// @desc    Generate entities for a project
// @route   POST /api/entities/generate/:projectId
// @access  Private
exports.generateEntities = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  // Generate entities using AI
  const entityData = await aiService.generateEntities(
    project.name,
    project.description
  );

  res.json({
    success: true,
    data: entityData.entities
  });
});

// @desc    Create new entity
// @route   POST /api/entities/:projectId
// @access  Private
exports.createEntity = asyncHandler(async (req, res) => {
  req.body.project = req.params.projectId;

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  const entity = await Entity.create(req.body);

  // Add entity to project's entities array
  await Project.findByIdAndUpdate(
    req.params.projectId,
    { $push: { entities: entity._id } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    data: entity
  });
});

// @desc    Get all entities for a project
// @route   GET /api/entities/:projectId
// @access  Private
exports.getEntities = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  const entities = await Entity.find({ project: req.params.projectId });

  res.json({
    success: true,
    count: entities.length,
    data: entities
  });
});

// @desc    Get single entity
// @route   GET /api/entities/:projectId/:id
// @access  Private
exports.getEntity = asyncHandler(async (req, res) => {
  const entity = await Entity.findById(req.params.id);

  if (!entity) {
    return res.status(404).json({ msg: 'Entity not found' });
  }

  const project = await Project.findById(entity.project);

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  res.json({
    success: true,
    data: entity
  });
});

// @desc    Update entity
// @route   PUT /api/entities/:projectId/:id
// @access  Private
exports.updateEntity = asyncHandler(async (req, res) => {
  let entity = await Entity.findById(req.params.id);

  if (!entity) {
    return res.status(404).json({ msg: 'Entity not found' });
  }

  const project = await Project.findById(entity.project);

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  entity = await Entity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: entity
  });
});

// @desc    Delete entity
// @route   DELETE /api/entities/:projectId/:id
// @access  Private
exports.deleteEntity = asyncHandler(async (req, res) => {
  const entity = await Entity.findById(req.params.id);

  if (!entity) {
    return res.status(404).json({ msg: 'Entity not found' });
  }

  const project = await Project.findById(entity.project);

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  await entity.remove();

  // Remove entity from project's entities array
  await Project.findByIdAndUpdate(
    entity.project,
    { $pull: { entities: req.params.id } },
    { new: true }
  );

  res.json({
    success: true,
    data: {}
  });
});