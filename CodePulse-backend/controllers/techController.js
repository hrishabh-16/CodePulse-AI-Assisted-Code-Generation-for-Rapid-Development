const Project = require('../models/Project');
const asyncHandler = require('../middleware/async');

// @desc    Get all tech stack options
// @route   GET /api/tech/options
// @access  Public
exports.getTechOptions = asyncHandler(async (req, res) => {
  const techOptions = {
    frontend: [
      { id: 'react', name: 'React' },
      { id: 'angular', name: 'Angular' },
      { id: 'vue', name: 'Vue.js' },
      { id: 'nextjs', name: 'Next.js' },
      { id: 'svelte', name: 'Svelte' },
      { id: 'html-css', name: 'HTML/CSS' },
      { id: 'tailwind', name: 'Tailwind CSS' }
    ],
    backend: [
      { id: 'nodejs', name: 'Node.js' },
      { id: 'express', name: 'Express.js' },
      { id: 'springboot', name: 'Spring Boot' },
      { id: 'django', name: 'Django' },
      { id: 'flask', name: 'Flask' },
      { id: 'golang', name: 'Go' },
      { id: 'laravel', name: 'Laravel' },
      { id: 'aspnet', name: 'ASP.NET' }
    ],
    database: [
      { id: 'mongodb', name: 'MongoDB' },
      { id: 'mysql', name: 'MySQL' },
      { id: 'postgresql', name: 'PostgreSQL' },
      { id: 'sqlserver', name: 'SQL Server' },
      { id: 'sqlite', name: 'SQLite' },
      { id: 'firebase', name: 'Firebase' }
    ],
    authentication: [
      { id: 'jwt', name: 'JWT' },
      { id: 'oauth', name: 'OAuth' },
      { id: 'firebase-auth', name: 'Firebase Auth' },
      { id: 'session', name: 'Session-based' }
    ],
    deployment: [
      { id: 'docker', name: 'Docker' },
      { id: 'heroku', name: 'Heroku' },
      { id: 'aws', name: 'AWS' },
      { id: 'azure', name: 'Azure' },
      { id: 'gcp', name: 'Google Cloud' }
    ]
  };

  res.json({
    success: true,
    data: techOptions
  });
});

// @desc    Update project tech stack
// @route   PUT /api/tech/:projectId
// @access  Private
exports.updateTechStack = asyncHandler(async (req, res) => {
  const { frontend, backend, database, authentication, deployment } = req.body;

  let project = await Project.findById(req.params.projectId);

  if (!project) {
    return res.status(404).json({ msg: 'Project not found' });
  }

  // Make sure user owns project
  if (project.user.toString() !== req.user.id) {
    return res.status(401).json({ msg: 'Not authorized' });
  }

  project = await Project.findByIdAndUpdate(
    req.params.projectId,
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