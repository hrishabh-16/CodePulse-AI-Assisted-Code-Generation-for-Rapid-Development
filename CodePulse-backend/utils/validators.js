/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false if invalid
 */
exports.isValidEmail = (email) => {
    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} - Validation result with isValid and message
   */
  exports.validatePassword = (password) => {
    if (!password || password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters'
      };
    }
  
    // Check for at least one uppercase letter, one lowercase letter, and one number
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/;
    if (!strongRegex.test(password)) {
      return {
        isValid: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      };
    }
  
    return {
      isValid: true,
      message: 'Password is valid'
    };
  };
  
  /**
   * Validate project input
   * @param {object} project - Project data to validate
   * @returns {object} - Validation result with isValid and errors
   */
  exports.validateProject = (project) => {
    const errors = {};
  
    if (!project.name) {
      errors.name = 'Project name is required';
    } else if (project.name.length > 50) {
      errors.name = 'Project name cannot exceed 50 characters';
    }
  
    if (!project.description) {
      errors.description = 'Project description is required';
    } else if (project.description.length > 500) {
      errors.description = 'Project description cannot exceed 500 characters';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validate entity input
   * @param {object} entity - Entity data to validate
   * @returns {object} - Validation result with isValid and errors
   */
  exports.validateEntity = (entity) => {
    const errors = {};
  
    if (!entity.name) {
      errors.name = 'Entity name is required';
    }
  
    if (!entity.description) {
      errors.description = 'Entity description is required';
    }
  
    if (!entity.fields || !Array.isArray(entity.fields) || entity.fields.length === 0) {
      errors.fields = 'At least one field is required';
    } else {
      entity.fields.forEach((field, index) => {
        if (!field.name) {
          errors[`fields[${index}].name`] = 'Field name is required';
        }
  
        if (!field.type) {
          errors[`fields[${index}].type`] = 'Field type is required';
        } else {
          const validTypes = ['String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Array', 'Object', 'Buffer'];
          if (!validTypes.includes(field.type)) {
            errors[`fields[${index}].type`] = 'Invalid field type';
          }
        }
      });
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Validate tech stack input
   * @param {object} techStack - Tech stack data to validate
   * @returns {object} - Validation result with isValid and errors
   */
  exports.validateTechStack = (techStack) => {
    const errors = {};
    
    const validFrontend = ['react', 'angular', 'vue', 'nextjs', 'svelte', 'html-css', 'tailwind'];
    const validBackend = ['nodejs', 'express', 'springboot', 'django', 'flask', 'golang', 'laravel', 'aspnet'];
    const validDatabase = ['mongodb', 'mysql', 'postgresql', 'sqlserver', 'sqlite', 'firebase'];
    const validAuth = ['jwt', 'oauth', 'firebase-auth', 'session'];
    const validDeployment = ['docker', 'heroku', 'aws', 'azure', 'gcp'];
  
    if (techStack.frontend && !validFrontend.includes(techStack.frontend)) {
      errors.frontend = 'Invalid frontend technology';
    }
  
    if (techStack.backend && !validBackend.includes(techStack.backend)) {
      errors.backend = 'Invalid backend technology';
    }
  
    if (techStack.database && !validDatabase.includes(techStack.database)) {
      errors.database = 'Invalid database technology';
    }
  
    if (techStack.authentication && !validAuth.includes(techStack.authentication)) {
      errors.authentication = 'Invalid authentication method';
    }
  
    if (techStack.deployment && !validDeployment.includes(techStack.deployment)) {
      errors.deployment = 'Invalid deployment option';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };