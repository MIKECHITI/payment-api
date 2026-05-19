const { verifyToken } = require('../utils/generateToken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    const error = new Error('No token provided');
    error.status = 401;
    return next(error);
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    error.status = 401;
    error.message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    next(error);
  }
};

module.exports = authMiddleware;
