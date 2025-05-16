/**
 * Format standard API success response
 * @param {object} data - Data to return
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {object} - Formatted API response
 */
exports.successResponse = (data, message = 'Success', statusCode = 200) => {
    return {
      success: true,
      statusCode,
      message,
      data
    };
  };
  
  /**
   * Format standard API error response
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   * @param {*} error - Error object or details
   * @returns {object} - Formatted error response
   */
  exports.errorResponse = (message = 'Error occurred', statusCode = 500, error = null) => {
    return {
      success: false,
      statusCode,
      message,
      error: error || null
    };
  };