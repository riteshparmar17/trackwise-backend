const jwt = require('jsonwebtoken');

const auth = (roles = []) => (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ success: false, message: 'Forbidden. You do not have access to this resource.' });
        }
        req.user = decoded;
        next();
    }catch (error) {
        res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }
};

module.exports = auth;