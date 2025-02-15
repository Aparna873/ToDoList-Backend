const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Ensure correct parsing
    req.user = decoded; // Attach user data (id, email, username) to request object
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};
module.exports = authMiddleware;
