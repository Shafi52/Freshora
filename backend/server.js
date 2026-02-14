require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
}));

// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/seller", require("./routes/sellerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// Payment routes (optional - requires Stripe keys)
try {
    if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "sk_test_your_stripe_secret_key_here") {
        app.use("/api/payment", require("./routes/paymentRoutes"));
        console.log("💳 Payment routes enabled");
    } else {
        console.log("⚠️  Payment routes disabled (add Stripe keys to enable)");
    }
} catch (error) {
    console.log("⚠️  Payment routes disabled:", error.message);
}

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("ERROR:", err);
    res.status(err.statusCode || 500).json({
        status: "error",
        message: err.message || "Something went wrong!",
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});
