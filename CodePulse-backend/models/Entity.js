const mongoose = require('mongoose');

const EntitySchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add an entity name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  fields: [
    {
      name: {
        type: String,
        required: [true, 'Please add a field name'],
        trim: true
      },
      type: {
        type: String,
        required: [true, 'Please add a field type'],
        enum: ['String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Array', 'Object', 'Buffer']
      },
      required: {
        type: Boolean,
        default: false
      },
      unique: {
        type: Boolean,
        default: false
      },
      ref: {
        type: String,
        default: null
      },
      default: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
      description: {
        type: String,
        default: ''
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Entity', EntitySchema);