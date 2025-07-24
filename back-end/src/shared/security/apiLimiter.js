const rateLimit = require('express-rate-limit');
const logger = require('../../utils/logger');

const apiLimiter = rateLimit({
  windowMs: 5*60 * 1000, // 5 minute
  max: 100, // Limit each IP to 100 requests per windowMs
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