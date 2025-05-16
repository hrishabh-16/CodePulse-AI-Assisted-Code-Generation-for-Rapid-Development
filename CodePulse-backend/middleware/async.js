/**
 * Async handler to avoid try-catch blocks in routes
 * @param {function} fn - Route handler function
 * @returns {function} - Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  
  module.exports = asyncHandler;