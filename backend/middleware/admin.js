const jwt = require("jsonwebtoken");

// Admin middleware - check if user is admin
const admin = (req, res, next) => {
    const token = req.header("token");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        req.user = verified;

        // Check if user is admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = admin;
