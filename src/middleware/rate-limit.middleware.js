const rateLimit = require('express-rate-limit');

// Rate limiter for admin endpoints
const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for sensitive admin operations (delete, update)
const sensitiveAdminRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many sensitive operations from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  adminRateLimiter,
  sensitiveAdminRateLimiter
}; 