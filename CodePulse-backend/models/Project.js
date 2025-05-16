const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  entities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Entity'
    }
  ],
  techStack: {
    frontend: {
      type: String,
      enum: ['react', 'angular', 'vue', 'nextjs', 'svelte', 'html-css', 'tailwind'],
      default: 'angular'
    },
    backend: {
      type: String,
      enum: ['nodejs', 'express', 'springboot', 'django', 'flask', 'golang', 'laravel', 'aspnet'],
      default: 'nodejs'
    },
    database: {
      type: String,
      enum: ['mongodb', 'mysql', 'postgresql', 'sqlserver', 'sqlite', 'firebase'],
      default: 'mongodb'
    },
    authentication: {
      type: String,
      enum: ['jwt', 'oauth', 'firebase-auth', 'session'],
      default: 'jwt'
    },
    deployment: {
      type: String,
      enum: ['docker', 'heroku', 'aws', 'azure', 'gcp'],
      default: 'docker'
    }
  },
  folderStructure: {
    type: Object,
    default: null
  },
  generatedCode: {
    type: Object,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);