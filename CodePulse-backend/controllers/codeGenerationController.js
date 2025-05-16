const Project = require('../models/Project');
const asyncHandler = require('../middleware/async');
const aiService = require('../services/aiService');
const zipService = require('../services/zipService');
const path = require('path');
const fs = require('fs');

// @desc    Generate folder structure for a project
// @route   POST /api/structure/:projectId
// @access  Private
exports.generateFolderStructure = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId).populate('entities');

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  // Generate folder structure using AI
  const folderStructure = await aiService.generateFolderStructure(project);

  // Create a base directory for this project
  const projectDir = path.join(__dirname, '../temp', project._id.toString());
  
  // Create the physical folder structure
  await zipService.createFolderStructure(folderStructure, projectDir);

  // Update project with folder structure
  await Project.findByIdAndUpdate(
    req.params.projectId,
    { 
      folderStructure,
      updatedAt: Date.now()
    },
    { new: true }
  );

  res.json({
    success: true,
    data: folderStructure
  });
});

// @desc    Generate code for a project
// @route   POST /api/code/:projectId
// @access  Private
exports.generateCode = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId).populate('entities');

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  // Check if folder structure exists
  if (!project.folderStructure) {
    return res.status(400).json({
      success: false,
      msg: 'Folder structure must be generated first'
    });
  }

  // Generate code using AI
  const generatedCode = await aiService.generateCode(project, project.folderStructure);

  // Get the project directory
  const projectDir = path.join(__dirname, '../temp', project._id.toString());
  
  // Write the generated code to the files
  await zipService.writeCodeToFiles(generatedCode, projectDir);

  // Update project with generated code
  await Project.findByIdAndUpdate(
    req.params.projectId,
    { 
      generatedCode,
      updatedAt: Date.now()
    },
    { new: true }
  );

  res.json({
    success: true,
    data: generatedCode
  });
});

// @desc    Download project as ZIP
// @route   GET /api/code/:projectId/download
// @access  Private
exports.downloadProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  // Check if code has been generated
  if (!project.generatedCode) {
    return res.status(400).json({
      success: false,
      msg: 'Code must be generated first'
    });
  }

  // Get the project directory path
  const projectDir = path.join(__dirname, '../temp', project._id.toString());
  
  // Check if the directory exists
  if (!fs.existsSync(projectDir)) {
    return res.status(404).json({
      success: false,
      msg: 'Project directory not found. Please regenerate the code.'
    });
  }

  try {
    // Create ZIP file from the project directory
    const zipFilePath = await zipService.createProjectZip(project, projectDir);
    
    // Set appropriate headers for binary file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/\s+/g, '-')}.zip"`);
    
    // Return the file as a download
    res.download(zipFilePath, `${project.name.replace(/\s+/g, '-')}.zip`, (err) => {
      if (err) {
        console.error('Error sending ZIP file:', err);
      }
      
      // Clean up the ZIP file after download (whether successful or not)
      if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
      }
    });
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    return res.status(500).json({ 
      success: false, 
      msg: 'Error creating ZIP file',
      error: error.message
    });
  }
});

// @desc    Get generated code for a project
// @route   GET /api/code/:projectId
// @access  Private
exports.getGeneratedCode = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  if (!project.generatedCode) {
    return res.status(404).json({
      success: false,
      msg: 'No code has been generated for this project'
    });
  }

  res.json({
    success: true,
    data: project.generatedCode
  });
});