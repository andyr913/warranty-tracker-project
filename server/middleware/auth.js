// middleware to protect routes requiring logged in user
const jwt = require('jsonwebtoken');
require('dotenv').config();

// verifies client token and attaches user to request object
function requireAuth(req, res, next) {
    // reads request header authorization to get auth token
    const authHeader = req.headers.authorization || '';
    // gets token or sets null
    // token starts with 'Bearer ' so slice removes that
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    // if no auth token returns 401 error
    if (!token)
        return res.status(401).json({error: 'Authentication failed'});

    try {
        // verifies token and allows next middleware to run
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        // if JWT verification fails, returns error
        return res.status(401).json({error: 'Invalid token'}); 
    }
}

// verifies current user has admin role
// must run after requireAuth to set req.user which is used in this function
function requireAdmin(req, res, next) {
    // allows next middleware to run if user is admin, otherwise returns error
    if (req.user.user_role === "admin") next();
    else return res.status(403).json({error: 'Unauthorized request'});
}

module.exports = {requireAuth, requireAdmin};

