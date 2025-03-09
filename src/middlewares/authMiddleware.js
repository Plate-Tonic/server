const jwt = require('jsonwebtoken');

// Middleware to validate JWT token
const validateToken = (req, res, next) => {
    console.log("validateToken middleware hit!");
    // Extract token from request header
    const token = req.header('Authorization')?.split(' ')[1];

    console.log("Token from request header:", token);  // Log token (should be null for non-users)

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Verify token and attach decoded user data to request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.authUserData = decoded;

        console.log("Decoded token:", decoded);

        // Check if user data exists in decoded token
        if (!req.authUserData?.userId || req.authUserData.isAdmin === undefined) {
            return res.status(400).json({ message: "User data is missing in the token." });
        }

        next();
    } catch (error) {
        console.log("Invalid token error:", error.message);
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = {
    validateToken
};