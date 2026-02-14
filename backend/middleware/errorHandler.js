// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Log error for debugging
    console.error("ERROR 💥:", err);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        err = new AppError(message, 400);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value: ${field}. Please use another value!`;
        err = new AppError(message, 400);
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el) => el.message);
        const message = `Invalid input data. ${errors.join(". ")}`;
        err = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        err = new AppError("Invalid token. Please log in again!", 401);
    }

    if (err.name === "TokenExpiredError") {
        err = new AppError("Your token has expired! Please log in again.", 401);
    }

    // Send error response
    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        // Production - don't leak error details
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            // Programming or unknown error
            console.error("ERROR 💥:", err);
            res.status(500).json({
                status: "error",
                message: "Something went wrong!",
            });
        }
    }
};

// 404 handler
const notFound = (req, res, next) => {
    const error = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(error);
};

module.exports = { AppError, errorHandler, notFound };
