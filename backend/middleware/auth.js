const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token expiry explicitly
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }

    // Find user
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    next();
  } catch (err) {
    // Specific JWT error messages
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please login again.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    if (err.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Token not yet active.' });
    }

    return res.status(401).json({ message: 'Authentication failed. Please login again.' });
  }
};

module.exports = { protect };