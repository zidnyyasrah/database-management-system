const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

function authMiddleware(req, res, next) {
    // Extract token
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'token tidak ditemukan' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = authMiddleware;
