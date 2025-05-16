const jwt = require('jsonwebtoken');
const config = require('config');

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} - JWT token
 */
exports.generateToken = (id) => {
  return jwt.sign(
    { user: { id } },
    process.env.JWT_SECRET || config.get('jwtSecret'),
    {
      expiresIn: process.env.JWT_EXPIRE || config.get('jwtExpire')
    }
  );
};