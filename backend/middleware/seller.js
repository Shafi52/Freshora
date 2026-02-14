const jwt = require("jsonwebtoken");

// Seller middleware - check if user is a seller
const seller = (req, res, next) => {
    const token = req.header("token");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        req.user = verified;

        // Check if user is seller or admin (admin can access seller routes too)
        if (req.user.role !== "seller" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Seller only." });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid" });
    }
};

module.exports = seller;
