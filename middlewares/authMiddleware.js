const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;  // Attach the decoded token (user info) to the request
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = authMiddleware;
