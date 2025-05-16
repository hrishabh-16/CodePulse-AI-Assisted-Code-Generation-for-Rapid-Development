/**
 * Generates MongoDB model template based on entity
 * @param {Object} entity - Entity object with name and fields
 * @returns {string} - Generated Mongoose model code
 */
exports.generateMongooseModel = (entity) => {
    const capitalizedName = entity.name.charAt(0).toUpperCase() + entity.name.slice(1);
    
    let fieldsCode = '';
    
    // Generate code for each field
    entity.fields.forEach(field => {
      let fieldCode = '';
      
      // Handle basic types
      if (['String', 'Number', 'Boolean', 'Date', 'Buffer'].includes(field.type)) {
        fieldCode = `  ${field.name}: {
      type: ${field.type},
      ${field.required ? 'required: true,' : ''}
      ${field.unique ? 'unique: true,' : ''}
      ${field.default !== undefined && field.default !== null ? `default: ${JSON.stringify(field.default)},` : ''}
      ${field.description ? `// ${field.description}` : ''}
    }`;
      } 
      // Handle ObjectId references
      else if (field.type === 'ObjectId') {
        fieldCode = `  ${field.name}: {
      type: mongoose.Schema.Types.ObjectId,
      ${field.ref ? `ref: '${field.ref}',` : ''}
      ${field.required ? 'required: true,' : ''}
      ${field.description ? `// ${field.description}` : ''}
    }`;
      }
      // Handle Array type
      else if (field.type === 'Array') {
        fieldCode = `  ${field.name}: [
      {
        type: ${field.arrayType || 'mongoose.Schema.Types.Mixed'}${field.ref ? `,\n      ref: '${field.ref}'` : ''}
      }
    ]`;
      }
      // Handle Object type
      else if (field.type === 'Object') {
        fieldCode = `  ${field.name}: {
      type: Object,
      default: {}
    }`;
      }
      
      fieldsCode += fieldCode + ',\n';
    });
    
    // Add timestamps
    fieldsCode += `  createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }`;
    
    return `const mongoose = require('mongoose');
  
  const ${capitalizedName}Schema = new mongoose.Schema({
  ${fieldsCode}
  });
  
  module.exports = mongoose.model('${capitalizedName}', ${capitalizedName}Schema);`;
  };
  
 /**
 * Generates Express controller template based on entity
 * @param {Object} entity - Entity object with name
 * @returns {string} - Generated Express controller code
 */
exports.generateExpressController = (entity) => {
    const capitalizedName = entity.name.charAt(0).toUpperCase() + entity.name.slice(1);
    const lowercaseName = entity.name.toLowerCase();
    
    return `const ${capitalizedName} = require('../models/${capitalizedName}');
  const asyncHandler = require('../middleware/async');
  
  // @desc    Get all ${lowercaseName}s
  // @route   GET /api/${lowercaseName}s
  // @access  Private
  exports.get${capitalizedName}s = asyncHandler(async (req, res) => {
    const ${lowercaseName}s = await ${capitalizedName}.find({ user: req.user.id });
  
    res.json({
      success: true,
      count: ${lowercaseName}s.length,
      data: ${lowercaseName}s
    });
  });
  
  // @desc    Get single ${lowercaseName}
  // @route   GET /api/${lowercaseName}s/:id
  // @access  Private
  exports.get${capitalizedName} = asyncHandler(async (req, res) => {
    const ${lowercaseName} = await ${capitalizedName}.findById(req.params.id);
  
    if (!${lowercaseName}) {
      return res.status(404).json({ msg: '${capitalizedName} not found' });
    }
  
    // Make sure user owns ${lowercaseName}
    if (${lowercaseName}.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
  
    res.json({
      success: true,
      data: ${lowercaseName}
    });
  });
  
  // @desc    Create new ${lowercaseName}
  // @route   POST /api/${lowercaseName}s
  // @access  Private
  exports.create${capitalizedName} = asyncHandler(async (req, res) => {
    // Add user to req.body
    req.body.user = req.user.id;
  
    const ${lowercaseName} = await ${capitalizedName}.create(req.body);
  
    res.status(201).json({
      success: true,
      data: ${lowercaseName}
    });
  });
  
  // @desc    Update ${lowercaseName}
  // @route   PUT /api/${lowercaseName}s/:id
  // @access  Private
  exports.update${capitalizedName} = asyncHandler(async (req, res) => {
    let ${lowercaseName} = await ${capitalizedName}.findById(req.params.id);
  
    if (!${lowercaseName}) {
      return res.status(404).json({ msg: '${capitalizedName} not found' });
    }
  
    // Make sure user owns ${lowercaseName}
    if (${lowercaseName}.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
  
    ${lowercaseName} = await ${capitalizedName}.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    res.json({
      success: true,
      data: ${lowercaseName}
    });
  });
  
  // @desc    Delete ${lowercaseName}
  // @route   DELETE /api/${lowercaseName}s/:id
  // @access  Private
  exports.delete${capitalizedName} = asyncHandler(async (req, res) => {
    const ${lowercaseName} = await ${capitalizedName}.findById(req.params.id);
  
    if (!${lowercaseName}) {
      return res.status(404).json({ msg: '${capitalizedName} not found' });
    }
  
    // Make sure user owns ${lowercaseName}
    if (${lowercaseName}.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
  
    await ${lowercaseName}.remove();
  
    res.json({
      success: true,
      data: {}
    });
  });`;
  };
  
  /**
   * Generates Express route template based on entity
   * @param {Object} entity - Entity object with name
   * @returns {string} - Generated Express route code
   */
  exports.generateExpressRoute = (entity) => {
    const capitalizedName = entity.name.charAt(0).toUpperCase() + entity.name.slice(1);
    const lowercaseName = entity.name.toLowerCase();
    
    return `const express = require('express');
  const router = express.Router();
  const {
    get${capitalizedName}s,
    get${capitalizedName},
    create${capitalizedName},
    update${capitalizedName},
    delete${capitalizedName}
  } = require('../../controllers/${lowercaseName}Controller');
  const auth = require('../../middleware/auth');
  
  // @route   GET /api/${lowercaseName}s
  // @desc    Get all ${lowercaseName}s
  // @access  Private
  router.get('/', auth, get${capitalizedName}s);
  
  // @route   GET /api/${lowercaseName}s/:id
  // @desc    Get single ${lowercaseName}
  // @access  Private
  router.get('/:id', auth, get${capitalizedName});
  
  // @route   POST /api/${lowercaseName}s
  // @desc    Create a ${lowercaseName}
  // @access  Private
  router.post('/', auth, create${capitalizedName});
  
  // @route   PUT /api/${lowercaseName}s/:id
  // @desc    Update a ${lowercaseName}
  // @access  Private
  router.put('/:id', auth, update${capitalizedName});
  
  // @route   DELETE /api/${lowercaseName}s/:id
  // @desc    Delete a ${lowercaseName}
  // @access  Private
  router.delete('/:id', auth, delete${capitalizedName});
  
  module.exports = router;`;
  };
  
  /**
   * Generates Angular service template for entity
   * @param {Object} entity - Entity object with name
   * @returns {string} - Generated Angular service code
   */
  exports.generateAngularService = (entity) => {
    const capitalizedName = entity.name.charAt(0).toUpperCase() + entity.name.slice(1);
    const lowercaseName = entity.name.toLowerCase();
    
    return `import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { environment } from 'src/environments/environment';
  
  export interface ${capitalizedName} {
    _id?: string;
    user?: string;
  ${entity.fields.map(field => `  ${field.name}: ${getTypeScriptType(field.type)};`).join('\n')}
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  @Injectable({
    providedIn: 'root'
  })
  export class ${capitalizedName}Service {
    private apiUrl = \`\${environment.apiUrl}/${lowercaseName}s\`;
  
    constructor(private http: HttpClient) { }
  
    get${capitalizedName}s(): Observable<{ success: boolean; data: ${capitalizedName}[] }> {
      return this.http.get<{ success: boolean; data: ${capitalizedName}[] }>(this.apiUrl);
    }
  
    get${capitalizedName}(id: string): Observable<{ success: boolean; data: ${capitalizedName} }> {
      return this.http.get<{ success: boolean; data: ${capitalizedName} }>(\`\${this.apiUrl}/\${id}\`);
    }
  
    create${capitalizedName}(${lowercaseName}Data: ${capitalizedName}): Observable<{ success: boolean; data: ${capitalizedName} }> {
      return this.http.post<{ success: boolean; data: ${capitalizedName} }>(this.apiUrl, ${lowercaseName}Data);
    }
  
    update${capitalizedName}(id: string, ${lowercaseName}Data: ${capitalizedName}): Observable<{ success: boolean; data: ${capitalizedName} }> {
      return this.http.put<{ success: boolean; data: ${capitalizedName} }>(\`\${this.apiUrl}/\${id}\`, ${lowercaseName}Data);
    }
  
    delete${capitalizedName}(id: string): Observable<{ success: boolean; data: {} }> {
      return this.http.delete<{ success: boolean; data: {} }>(\`\${this.apiUrl}/\${id}\`);
    }
  }
  
  // Helper function to convert MongoDB types to TypeScript types
  function getTypeScriptType(mongoType: string): string {
    switch (mongoType) {
      case 'String':
        return 'string';
      case 'Number':
        return 'number';
      case 'Boolean':
        return 'boolean';
      case 'Date':
        return 'Date';
      case 'ObjectId':
        return 'string';
      case 'Array':
        return 'any[]';
      case 'Object':
        return 'any';
      case 'Buffer':
        return 'any';
      default:
        return 'any';
    }
  }`;
  };
  
  /**
   * Generates Angular component template for entity CRUD
   * @param {Object} entity - Entity object with name
   * @returns {Object} - Generated Angular component files
   */
  exports.generateAngularComponent = (entity) => {
    const capitalizedName = entity.name.charAt(0).toUpperCase() + entity.name.slice(1);
    const lowercaseName = entity.name.toLowerCase();
    
    // HTML Template
    const templateHtml = `<div class="container mt-4">
    <h2>${capitalizedName} Management</h2>
    
    <!-- Form -->
    <div class="card mb-4">
      <div class="card-header">
        <h4>{{ isEditing ? 'Edit' : 'Add' }} ${capitalizedName}</h4>
      </div>
      <div class="card-body">
        <form (ngSubmit)="onSubmit()">
  ${entity.fields.map(field => {
    // Determine the input type based on the field type
    let inputType = 'text';
    if (field.type === 'Number') inputType = 'number';
    if (field.type === 'Boolean') inputType = 'checkbox';
    if (field.type === 'Date') inputType = 'date';
    
    // For Boolean fields, use checkbox
    if (field.type === 'Boolean') {
      return `        <div class="form-check mb-3">
            <input type="checkbox" class="form-check-input" id="${field.name}" 
                   name="${field.name}" [(ngModel)]="${lowercaseName}.${field.name}">
            <label class="form-check-label" for="${field.name}">${field.name}</label>
          </div>`;
    }
    
    // For other fields, use appropriate input
    return `        <div class="form-group mb-3">
            <label for="${field.name}">${field.name}</label>
            <input type="${inputType}" class="form-control" id="${field.name}" 
                   name="${field.name}" [(ngModel)]="${lowercaseName}.${field.name}" 
                   ${field.required ? 'required' : ''}>
          </div>`;
  }).join('\n')}
          
          <button type="submit" class="btn btn-primary">{{ isEditing ? 'Update' : 'Save' }}</button>
          <button type="button" class="btn btn-secondary ms-2" *ngIf="isEditing" (click)="resetForm()">Cancel</button>
        </form>
      </div>
    </div>
    
    <!-- List -->
    <div class="card">
      <div class="card-header">
        <h4>${capitalizedName} List</h4>
      </div>
      <div class="card-body">
        <div *ngIf="${lowercaseName}s.length === 0" class="alert alert-info">
          No ${lowercaseName}s found.
        </div>
        <table class="table table-striped" *ngIf="${lowercaseName}s.length > 0">
          <thead>
            <tr>
  ${entity.fields.map(field => `            <th>${field.name}</th>`).join('\n')}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of ${lowercaseName}s">
  ${entity.fields.map(field => {
    if (field.type === 'Date') {
      return `            <td>{{ item.${field.name} | date }}</td>`;
    } else if (field.type === 'Boolean') {
      return `            <td>{{ item.${field.name} ? 'Yes' : 'No' }}</td>`;
    } else {
      return `            <td>{{ item.${field.name} }}</td>`;
    }
  }).join('\n')}
              <td>
                <button class="btn btn-sm btn-primary me-2" (click)="edit${capitalizedName}(item)">Edit</button>
                <button class="btn btn-sm btn-danger" (click)="delete${capitalizedName}(item._id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
  
    // Component TypeScript
    const componentTs = `import { Component, OnInit } from '@angular/core';
  import { ${capitalizedName}, ${capitalizedName}Service } from '../../services/${lowercaseName}.service';
  
  @Component({
    selector: 'app-${lowercaseName}',
    templateUrl: './${lowercaseName}.component.html',
    styleUrls: ['./${lowercaseName}.component.scss']
  })
  export class ${capitalizedName}Component implements OnInit {
    ${lowercaseName}s: ${capitalizedName}[] = [];
    ${lowercaseName}: ${capitalizedName} = ${getInitialEntityObject(entity)};
    isEditing = false;
    currentId = '';
  
    constructor(private ${lowercaseName}Service: ${capitalizedName}Service) { }
  
    ngOnInit(): void {
      this.load${capitalizedName}s();
    }
  
    load${capitalizedName}s(): void {
      this.${lowercaseName}Service.get${capitalizedName}s().subscribe(
        response => {
          this.${lowercaseName}s = response.data;
        },
        error => {
          console.error('Error fetching ${lowercaseName}s', error);
        }
      );
    }
  
    onSubmit(): void {
      if (this.isEditing) {
        this.${lowercaseName}Service.update${capitalizedName}(this.currentId, this.${lowercaseName}).subscribe(
          response => {
            this.load${capitalizedName}s();
            this.resetForm();
          },
          error => {
            console.error('Error updating ${lowercaseName}', error);
          }
        );
      } else {
        this.${lowercaseName}Service.create${capitalizedName}(this.${lowercaseName}).subscribe(
          response => {
            this.load${capitalizedName}s();
            this.resetForm();
          },
          error => {
            console.error('Error creating ${lowercaseName}', error);
          }
        );
      }
    }
  
    edit${capitalizedName}(${lowercaseName}: ${capitalizedName}): void {
      this.isEditing = true;
      this.currentId = ${lowercaseName}._id;
      this.${lowercaseName} = { ...${lowercaseName} };
    }
  
    delete${capitalizedName}(id: string): void {
      if (confirm('Are you sure you want to delete this ${lowercaseName}?')) {
        this.${lowercaseName}Service.delete${capitalizedName}(id).subscribe(
          response => {
            this.load${capitalizedName}s();
          },
          error => {
            console.error('Error deleting ${lowercaseName}', error);
          }
        );
      }
    }
  
    resetForm(): void {
      this.${lowercaseName} = ${getInitialEntityObject(entity)};
      this.isEditing = false;
      this.currentId = '';
    }
  }
  
  // Helper function to get initial entity object with default values
  function ${getInitialEntityObject.toString()}`;
  
    // Component SCSS
    const componentScss = `/* ${capitalizedName} Component Styles */
  .card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
  }
  
  .card-header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #eaeaea;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
  }
  
  .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }
  
  .table {
    margin-bottom: 0;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  `;
  
    return {
      html: templateHtml,
      ts: componentTs,
      scss: componentScss
    };
  };
  
  // Helper function to initialize entity object with default values
  function getInitialEntityObject(entity) {
    let initialObject = '{';
    
    entity.fields.forEach(field => {
      let defaultValue;
      
      switch (field.type) {
        case 'String':
          defaultValue = "''";
          break;
        case 'Number':
          defaultValue = '0';
          break;
        case 'Boolean':
          defaultValue = 'false';
          break;
        case 'Date':
          defaultValue = 'new Date()';
          break;
        case 'Array':
          defaultValue = '[]';
          break;
        case 'Object':
          defaultValue = '{}';
          break;
        default:
          defaultValue = 'null';
      }
      
      initialObject += `\n    ${field.name}: ${defaultValue},`;
    });
    
    initialObject += '\n  }';
    return initialObject;
  }