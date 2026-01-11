const jwt = require('jsonwebtoken');
const { Teacher } = require('../db');

const authMiddleware = async (req, res, next) => {
    // First, check if the authorization header exists and is correctly formatted.
    // If not, send an error and stop execution immediately.
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Get token from header (e.g., "Bearer eyJhbGci...")
        const token = req.headers.authorization.split(' ')[1];

        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the teacher in the database using the ID from the token
        // We also exclude the password from the data we attach to the request
        req.user = await Teacher.findById(decoded.id).select('-password');
        
        // If no user is found with this ID, the token is invalid
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // If everything is successful, proceed to the actual route handler (e.g., addItem)
        next();
        
    } catch (error) {
        // This block will catch any errors from jwt.verify (e.g., an expired token)
        console.error('Authentication error:', error.message);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = authMiddleware;