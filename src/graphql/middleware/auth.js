const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');

const authMiddleware = async ({ req }) => {
  // Get the token from the header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return { user: null };
  }

  try {
    // Verify token
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return { user: null };
    }

    return { user };
  } catch (error) {
    return { user: null };
  }
};

module.exports = authMiddleware; 