const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to  5 requests per windowMs
  message: {
    status: 'error',
    error: 'Too many requests, please try again later after a minute.',
    message: 'Rate limit exceeded'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on path: ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  }
});

module.exports = apiLimiter;