const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const asyncHandler = require('../middleware/async');
const { v4: uuidv4 } = require('uuid');

/**
 * Create directory recursively
 * @param {string} dirPath 
 */
const createDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Write file content
 * @param {string} filePath 
 * @param {string|Object} content 
 */
const writeFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  createDirectory(dir);
  
  // Convert content to string if it's an object
  const contentToWrite = typeof content === 'object' && content !== null 
    ? JSON.stringify(content, null, 2)  // Pretty print JSON with 2 spaces
    : content || '';  // Empty string for null/undefined
    
  fs.writeFileSync(filePath, contentToWrite);
};

/**
 * Create folder structure based on the JSON structure
 * @param {Object} folderStructure - Nested object representing folder structure
 * @param {string} baseDir - Base directory to create structure in
 * @param {string} currentPath - Current path (used in recursion)
 */
exports.createFolderStructure = asyncHandler(async (folderStructure, baseDir, currentPath = '') => {
  console.log('Creating folder structure at:', baseDir);
  
  // Ensure the base directory exists
  createDirectory(baseDir);
  
  // If the structure is empty, stop here
  if (!folderStructure || typeof folderStructure !== 'object') {
    return;
  }
  
  // Process each item in the folder structure
  for (const [name, content] of Object.entries(folderStructure)) {
    const itemPath = path.join(baseDir, currentPath, name);
    
    if (typeof content === 'object' && content !== null) {
      // It's a directory - create it and process recursively
      console.log('Creating directory:', itemPath);
      createDirectory(itemPath);
      
      // Recursively create the structure inside this directory
      await exports.createFolderStructure(content, baseDir, path.join(currentPath, name));
    } else {
      // It's a file - just create an empty file for now
      console.log('Creating empty file:', itemPath);
      writeFile(itemPath, '');
    }
  }
});

/**
 * Write generated code to files
 * @param {Object} codeData - Object with file paths as keys and code as values
 * @param {string} baseDir - Base directory where files should be written
 */
exports.writeCodeToFiles = asyncHandler(async (codeData, baseDir) => {
  console.log('Writing code to files in:', baseDir);
  
  if (!fs.existsSync(baseDir)) {
    console.error('Base directory does not exist:', baseDir);
    createDirectory(baseDir);
  }
  
  for (const [filePath, content] of Object.entries(codeData)) {
    try {
      const fullPath = path.join(baseDir, filePath);
      console.log('Writing code to file:', fullPath);
      writeFile(fullPath, content);
    } catch (error) {
      console.error(`Error writing code to file ${filePath}:`, error);
      // Continue with other files even if one fails
    }
  }
});

/**
 * Create project ZIP file
 * @param {Object} projectData - Project data
 * @param {string} sourceDir - Directory to zip
 * @returns {Promise<string>} - Path to created ZIP file
 */
exports.createProjectZip = asyncHandler(async (projectData, sourceDir) => {
  console.log('Creating project ZIP file from directory:', sourceDir);
  
  // Create a unique filename for the ZIP
  const projectName = projectData.name.replace(/\s+/g, '-');
  const timestamp = Date.now();
  const zipFilePath = path.join(__dirname, '../temp', `${projectName}-${timestamp}.zip`);

  // Create ZIP archive
  return new Promise((resolve, reject) => {
    console.log('Creating ZIP archive at:', zipFilePath);
    
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Listen for all archive data to be written
    output.on('close', () => {
      console.log('ZIP archive created successfully, size:', archive.pointer(), 'bytes');
      resolve(zipFilePath);
    });

    // Good practice to catch warnings
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archive warning:', err);
      } else {
        reject(err);
      }
    });

    // Handle errors
    archive.on('error', (err) => {
      console.error('Error creating ZIP archive:', err);
      reject(err);
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add the directory contents to the archive
    archive.directory(sourceDir, false);

    // Finalize the archive (i.e., finish the writing process)
    archive.finalize();
  });
});
/**
 * Create ZIP archive from project files
 * @param {string} sourceDir 
 * @param {string} outputPath 
 * @returns {Promise<string>}
 */
const createZipArchive = (sourceDir, outputPath) => {
  return new Promise((resolve, reject) => {
    console.log('Creating ZIP archive at:', outputPath);
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      console.log('ZIP archive created successfully');
      resolve(outputPath);
    });

    archive.on('error', (err) => {
      console.error('Error creating ZIP archive:', err);
      reject(err);
    });

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
};

/**
 * Clean up temporary files
 * @param {string} zipFilePath 
 */
exports.cleanupTempFiles = asyncHandler(async (zipFilePath) => {
  console.log('Cleaning up temporary files...');
  
  try {
    // Delete zip file if it exists
    if (fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath);
      console.log('Deleted ZIP file:', zipFilePath);
    }
  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
    // Don't throw the error to prevent interrupting the response
  }
});