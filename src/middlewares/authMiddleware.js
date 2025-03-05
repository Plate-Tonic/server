const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    if (req.path === '/user/calorie-tracker') {
        return next();
    }

    // Validate token for routes that start with /user
    if (req.path.startsWith('/user')) {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach decoded user data to request

            // Check if user data exists in the decoded token
            if (!req.user?.userId || req.user.isAdmin === undefined) {
                return res.status(400).json({ message: "User data is missing in the token." });
            }

            next(); // Allow access to protected route for logged-in users
        } catch (error) {
            res.status(400).json({ message: "Invalid token." });
        }
    } else {
        next(); // Allow non-user routes to proceed without token validation
    }
};

module.exports = {
    validateToken
};