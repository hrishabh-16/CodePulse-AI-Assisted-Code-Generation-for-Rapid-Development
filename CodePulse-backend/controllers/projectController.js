const Project = require('../models/Project');
const asyncHandler = require('../middleware/async');

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    user: req.user.id
  });

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ user: req.user.id });

  res.json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('entities');

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  res.json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  await project.remove();

  res.json({
    success: true,
    data: {}
  });
});

// @desc    Update project tech stack
// @route   PUT /api/projects/:id/tech
// @access  Private
exports.updateProjectTechStack = asyncHandler(async (req, res) => {
  const { frontend, backend, database, authentication, deployment } = req.body;

  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  project = await Project.findByIdAndUpdate(
    req.params.id,
    {
      techStack: {
        frontend,
        backend,
        database,
        authentication,
        deployment
      },
      updatedAt: Date.now()
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    data: project
  });
});