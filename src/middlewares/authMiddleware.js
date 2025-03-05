const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if the decoded token includes required data
        if (!req.user?.userId || req.user.isAdmin === undefined) {
            return res.status(400).json({ message: "User data is missing in the token." });
        }

        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = {
    validateToken
};