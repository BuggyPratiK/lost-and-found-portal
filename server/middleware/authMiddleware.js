const jwt = require('jsonwebtoken');
const { Teacher } = require('../db');

const authMiddleware = async (req, res, next) => {
    // First, check if the authorization header exists and is correctly formatted.
    // If not, send an error and stop execution immediately.
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Get token from header and verify it
        const token = req.headers.authorization.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await Teacher.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // If everything is successful, proceed to the actual route handler (e.g., addItem)
        next();
        
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = authMiddleware;