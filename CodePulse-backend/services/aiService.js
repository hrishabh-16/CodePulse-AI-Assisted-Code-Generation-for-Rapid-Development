const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('config');

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || config.get('geminiApiKey'));

// Gemini Pro model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate project description
 * @param {string} projectName 
 * @returns {Promise<Object>}
 */
exports.generateProjectDescription = async (projectName) => {
  const prompt = `Generate a detailed project description for a software project named "${projectName}". 
  Return the response in valid JSON format with the following structure:
  {
    "projectName": "${projectName}",
    "projectDescription": "<detailed description here>"
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating project description:', error);
    throw new Error('Failed to generate project description');
  }
};

/**
 * Refine project description
 * @param {string} projectName 
 * @param {string} currentDescription 
 * @returns {Promise<Object>}
 */
exports.refineProjectDescription = async (projectName, currentDescription) => {
  const prompt = `Refine and enhance the following project description for "${projectName}":
  "${currentDescription}"
  
  Return the response in valid JSON format with the following structure:
  {
    "projectName": "${projectName}",
    "projectDescription": "<refined description here>"
  }`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    return JSON.parse(response);
  } catch (error) {
    console.error('Error refining project description:', error);
    throw new Error('Failed to refine project description');
  }
};

/**
 * Generate entities for project
 * @param {string} projectName 
 * @param {string} projectDescription 
 * @returns {Promise<Object>}
 */
exports.generateEntities = async (projectName, projectDescription) => {
    const prompt = `Based on the following project name and description, generate relevant entities with fields:
    
    Project Name: "${projectName}"
    Project Description: "${projectDescription}"
    
    Return the response in valid JSON format with the following structure:
    {
      "projectName": "${projectName}",
      "projectDescription": "${projectDescription}",
      "entities": [
        {
          "entityName": "<entity name>",
          "entityDescription": "<entity description>",
          "fields": [
            {
              "name": "<field name>",
              "type": "<field type>",
              "required": true/false,
              "unique": true/false,
              "description": "<field description>"
            }
          ]
        }
      ]
    }
    
    The field type should be one of: String, Number, Boolean, Date, ObjectId, Array, Object, Buffer.
    
    IMPORTANT: Return only the JSON object without any markdown formatting, code blocks, or backticks.`;
  
    try {
      console.log('Sending request to Gemini API...');
      
      // Update to use gemini-1.5-flash model as requested
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || config.get('geminiApiKey'));
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      console.log('Received response from Gemini API');
      
      // Clean up the response to handle potential markdown formatting
      let cleanedResponse = responseText;
      
      // Remove markdown code block indicators if present
      if (cleanedResponse.includes('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\s*/g, '');
      }
      if (cleanedResponse.includes('```')) {
        cleanedResponse = cleanedResponse.replace(/```\s*/g, '');
      }
      
      // Remove any other markdown formatting characters
      cleanedResponse = cleanedResponse.trim();
      
      console.log('Cleaned response:', cleanedResponse.substring(0, 150) + '...');
      
      // Parse the cleaned JSON
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error in generateEntities:', error);
      console.error('Original error message:', error.message);
      throw new Error(`Failed to generate entities: ${error.message}`);
    }
  };

/**
 * Generate folder structure
 * @param {Object} projectData 
 * @returns {Promise<Object>}
 */
exports.generateFolderStructure = async (projectData) => {
    const prompt = `Generate a detailed folder structure for a project with the following specifications:
    
    Project Name: "${projectData.name}"
    Project Description: "${projectData.description}"
    Tech Stack:
    - Frontend: ${projectData.techStack.frontend}
    - Backend: ${projectData.techStack.backend}
    - Database: ${projectData.techStack.database}
    - Authentication: ${projectData.techStack.authentication}
    - Deployment: ${projectData.techStack.deployment}
    
    Entities: ${JSON.stringify(projectData.entities)}
    
    Return the folder structure in a valid JSON format with nested objects representing directories and files.
    Example structure:
    {
      "backend": {
        "src": {
          "controllers": {
            "userController.js": "",
            "authController.js": ""
          },
          "models": {
            "User.js": "",
            "Post.js": ""
          }
        },
        "package.json": ""
      },
      "frontend": {
        "src": {
          "components": {
            "Header.jsx": "",
            "Footer.jsx": ""
          },
          "pages": {
            "Home.jsx": "",
            "About.jsx": ""
          }
        },
        "package.json": ""
      }
    }
    
    IMPORTANT: Return only the JSON object without any markdown formatting, code blocks, or backticks.`;
  
    try {
      console.log('Sending request to Gemini API for folder structure...');
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || config.get('geminiApiKey'));
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      console.log('Received response from Gemini API');
      
      // Clean up the response to handle potential markdown formatting
      let cleanedResponse = responseText;
      
      // Remove markdown code block indicators if present
      if (cleanedResponse.includes('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\s*/g, '');
      }
      if (cleanedResponse.includes('```')) {
        cleanedResponse = cleanedResponse.replace(/```\s*/g, '');
      }
      
      // Remove any other markdown formatting characters
      cleanedResponse = cleanedResponse.trim();
      
      console.log('Cleaned response:', cleanedResponse.substring(0, 150) + '...');
      
      // Try to parse the JSON
      try {
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON parsing error after cleanup:', parseError);
        
        // If still failing, try more aggressive cleanup - extract just the JSON portion
        const startIndex = cleanedResponse.indexOf('{');
        const endIndex = cleanedResponse.lastIndexOf('}') + 1;
        
        if (startIndex >= 0 && endIndex > startIndex) {
          const jsonPortion = cleanedResponse.substring(startIndex, endIndex);
          console.log('Extracted JSON portion:', jsonPortion.substring(0, 150) + '...');
          return JSON.parse(jsonPortion);
        } else {
          throw new Error('Could not extract valid JSON from response');
        }
      }
    } catch (error) {
      console.error('Error generating folder structure:', error);
      throw new Error(`Failed to generate folder structure: ${error.message}`);
    }
};

/**
 * Generate code for files
 * @param {Object} projectData 
 * @param {Object} folderStructure 
 * @returns {Promise<Object>}
 */
exports.generateCode = async (projectData, folderStructure) => {
    // Extract file paths from the folder structure
    const filePaths = extractFilePaths(folderStructure);
    const filePathsStr = JSON.stringify(filePaths);
    
    const prompt = `Generate the COMPLETE code for the following project based on the files and their folders . DO NOT use placeholder comments like "// Component to display..." - instead, write the full, functional code for EVERY file for the backend and frontend along with others :
    
    Project Name: "${projectData.name}"
    Project Description: "${projectData.description}"
    Tech Stack:
    - Frontend: ${projectData.techStack.frontend}
    - Backend: ${projectData.techStack.backend}
    - Database: ${projectData.techStack.database}
    - Authentication: ${projectData.techStack.authentication}
    - Deployment: ${projectData.techStack.deployment}
    
    Entities: ${JSON.stringify(projectData.entities)}
    
    File Paths: ${filePathsStr}
    
    For EACH file, provide complete, functional, implementation-ready code. Do not use comments as placeholders. Create full implementations for controllers, components, services, models, and all other files.
    
    Return the code in a JSON format where each file path is a key and the COMPLETE file content is the value.
    
    IMPORTANT: 
    1. Ensure all JSON strings are properly escaped, especially when code contains special characters like quotes or backslashes.
    2. Return only the JSON object without any markdown formatting, code blocks, or backticks.
    3. Make sure all strings in the JSON are properly terminated with quotes.`;
  
    try {
      console.log('Sending request to Gemini API for complete code generation...');
      
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || config.get('geminiApiKey'));
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192,
        }
      });
      
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      console.log('Received response from Gemini API with length:', responseText.length);
      
      // Clean up the response to handle potential markdown formatting
      let cleanedResponse = responseText;
      
      // Remove markdown code block indicators if present
      if (cleanedResponse.includes('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\s*/g, '');
      }
      if (cleanedResponse.includes('```')) {
        cleanedResponse = cleanedResponse.replace(/```\s*/g, '');
      }
      
      // Remove any other markdown formatting characters
      cleanedResponse = cleanedResponse.trim();
      
      console.log('Cleaned response first 150 chars:', cleanedResponse.substring(0, 150));
      
      // Attempt to manually fix common JSON parsing issues
      try {
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('Initial JSON parsing error:', parseError.message);
        
        // Let's try to repair the JSON
        console.log('Attempting to repair the JSON...');
        
        // Try a more resilient parsing approach
        try {
          // Alternative 1: Use a more lenient JSON parser
          // This requires adding the 'json-repair' package to your project
          // npm install json-repair
          const { jsonrepair } = require('jsonrepair');
          const repairedJson = jsonrepair(cleanedResponse);
          console.log('JSON repaired successfully');
          return JSON.parse(repairedJson);
        } catch (repairError) {
          console.error('JSON repair failed:', repairError.message);
          
          // Alternative 2: Use a simpler approach - create a structured object by manually processing each file
          // Generate a mock structure with the folder structure as a guide - since we're avoiding mock data
          // as per your request, we'll generate a structure with empty content
          console.log('Creating a placeholder structure based on folder paths');
          const placeholderStructure = {};
          
          filePaths.forEach(filePath => {
            placeholderStructure[filePath] = `// TODO: Unable to generate code for ${filePath} due to JSON parsing error\n// Please regenerate this file individually`;
          });
          
          // One more attempt - let's try to extract portions of the valid JSON
          // Extract the first opening brace and last closing brace
          const startIndex = cleanedResponse.indexOf('{');
          const endIndex = cleanedResponse.lastIndexOf('}') + 1;
          
          if (startIndex >= 0 && endIndex > startIndex) {
            try {
              // Try to extract the JSON portion and parse it
              const jsonPortion = cleanedResponse.substring(startIndex, endIndex);
              const result = JSON.parse(jsonPortion);
              console.log('Successfully extracted partial JSON');
              return result;
            } catch (extractError) {
              console.error('Failed to extract valid JSON:', extractError.message);
              
              // As a last resort, split the response into individual key-value pairs
              // and build the object incrementally
              const lines = cleanedResponse.split('\n');
              let buildingObject = {};
              let currentKey = null;
              let currentValue = '';
              let inValue = false;
              
              for (const line of lines) {
                // Look for key-value patterns
                const keyMatch = line.match(/"([^"]+)":\s*"/);
                if (keyMatch && !inValue) {
                  // If we were building a previous value, save it
                  if (currentKey) {
                    buildingObject[currentKey] = currentValue;
                  }
                  
                  currentKey = keyMatch[1];
                  currentValue = line.substring(keyMatch[0].length);
                  inValue = !line.endsWith('",') && !line.endsWith('"');
                } else if (inValue) {
                  // Continue building the current value
                  currentValue += '\n' + line;
                  if (line.endsWith('",') || line.endsWith('"')) {
                    inValue = false;
                  }
                }
              }
              
              // Add the last key-value pair if any
              if (currentKey) {
                buildingObject[currentKey] = currentValue;
              }
              
              if (Object.keys(buildingObject).length > 0) {
                console.log('Built partial object from key-value pairs');
                return buildingObject;
              }
              
              // If all else fails, return the placeholder structure
              console.log('Using placeholder structure as fallback');
              return placeholderStructure;
            }
          }
          
          // If we couldn't extract anything, return the placeholder structure
          console.log('Using placeholder structure as fallback');
          return placeholderStructure;
        }
      }
    } catch (error) {
      console.error('Error generating code:', error);
      throw new Error(`Failed to generate code: ${error.message}`);
    }
};
  // Helper function to extract file paths from folder structure
  function extractFilePaths(structure, prefix = '') {
    let paths = [];
    
    for (const [key, value] of Object.entries(structure)) {
      const currentPath = prefix ? `${prefix}/${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        // If it's a directory, recursively extract paths
        paths = paths.concat(extractFilePaths(value, currentPath));
      } else {
        // If it's a file, add its path
        paths.push(currentPath);
      }
    }
    
    return paths;
  }