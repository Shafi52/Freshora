const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

// Security headers middleware
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
});

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/register requests per windowMs
    message: "Too many authentication attempts, please try again later.",
    skipSuccessfulRequests: true,
});

// NoSQL injection prevention
const sanitizeData = mongoSanitize({
    replaceWith: "_",
});

// XSS protection
const preventXSS = xss();

// HTTP Parameter Pollution prevention
const preventHPP = hpp({
    whitelist: ["price", "category", "rating"], // Allow duplicate params for filtering
});

module.exports = {
    securityHeaders,
    limiter,
    authLimiter,
    sanitizeData,
    preventXSS,
    preventHPP,
};
