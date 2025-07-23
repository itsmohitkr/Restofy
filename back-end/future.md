# Future Feature: AI-Powered Chatbot Restaurant Search for Unauthenticated Users

## Feature Overview
Implement an AI-powered chatbot on the landing page that allows unauthenticated users to search for restaurants using natural language queries. Users can ask for restaurants "near me" with specific requirements, such as a minimum number of available seats and a minimum customer rating.

## User Story
- As a visitor to the landing page, I want to interact with a chatbot and ask questions like:
  - "Show me restaurants near me with at least 3 seats available and ratings above 4.5."
- The chatbot should understand my query, extract the relevant filters, and display a list of matching restaurants.

## Technical Approach
1. **Chatbot UI (Frontend):**
   - Integrate a chatbot component in the React frontend.
   - Allow users to type or speak queries.
   - Optionally, use browser geolocation to get the user's location.

2. **NLP/AI Query Understanding:**
   - Use an AI service (e.g., OpenAI GPT API) to parse user queries and extract search parameters (location, min seats, min rating).
   - Alternatively, use a simple NLP library for basic parsing.

3. **Backend API:**
   - Expose a public endpoint (e.g., `/api/restaurants/search`) that accepts filters such as location, minSeats, and minRating.
   - Query the database for restaurants matching these criteria, including available seats and customer ratings.

4. **Geolocation:**
   - Use the browser's geolocation API to get the user's coordinates for "near me" searches.
   - Pass these coordinates to the backend for proximity-based filtering.

5. **Security & Rate Limiting:**
   - Implement rate limiting on the public API to prevent abuse.
   - Ensure no sensitive data is exposed in the public search results.

## Possible Tech Stack
- **Frontend:** React, chatbot component (e.g., react-chatbot-kit, BotUI)
- **NLP/AI:** OpenAI GPT API, or a simple NLP library (compromise, natural)
- **Backend:** Node.js/Express, Prisma
- **Database:** Existing schema, with possible geospatial queries

## Learning: How to Add Custom Error Types for Error Handling

In production-level Node.js/Express apps, it is a best practice to define your own global error type enum or object. This allows you to standardize error handling, make your code more maintainable, and provide consistent error responses across your API.

### Example: Defining a Global Error Type Enum/Object

```js
// back-end/src/constants/errorTypes.js
const ERROR_TYPES = {
  VALIDATION_ERROR: 'ValidationError',
  MISSING_FIELD: 'MissingField',
  INVALID_FIELD: 'InvalidField',
  DUPLICATE_RESOURCE: 'DuplicateResource',
  RESOURCE_NOT_FOUND: 'ResourceNotFound',
  UNAUTHORIZED_ACTION: 'UnauthorizedAction',
  FORBIDDEN: 'Forbidden',
  CONFLICT: 'Conflict',
  INVALID_QUERY_PARAM: 'InvalidQueryParam',
  INVALID_PATH_PARAM: 'InvalidPathParam',
  UNSUPPORTED_OPERATION: 'UnsupportedOperation',
  BODY_NOT_ALLOWED: 'BodyNotAllowed',
  TOO_MANY_REQUESTS: 'TooManyRequests',
  // ...add more as needed
};
module.exports = ERROR_TYPES;
```

### How to Use

- Import and use these error types in your controllers and middleware when sending error responses:

```js
const ERROR_TYPES = require('../constants/errorTypes');
return res.status(400).json({
  status: 400,
  message: "Contact number is required",
  error: ERROR_TYPES.MISSING_FIELD
});
```

### Best Practices
- Use a consistent error format in all responses.
- Map error types to appropriate HTTP status codes in your error handler.
- Add new error types as your business logic grows.
- Optionally, use a library like `http-errors` or `Boom` for protocol-level errors, and your custom enum for business/domain errors.

This approach is widely used in production for clarity, maintainability, and scalability of error handling.

## Notes
- This feature is intended for unauthenticated users and should be accessible from the landing page.
- The chatbot should provide a conversational and user-friendly experience.
- Consider extensibility for more advanced queries and future AI enhancements. 

## Seeding the Database with JSON Data Using Prisma

You can seed your PostgreSQL database with data from JSON files using Prisma and Node.js. This is useful for development and testing. Here’s how to do it:

### 1. Create Your JSON Data Files

Place your data in JSON files, e.g.:

**prisma/seed-data/menuItems.json**
```json
[
  {
    "itemName": "Margherita Pizza",
    "itemDescription": "Classic cheese and tomato pizza",
    "itemPrice": 9.99,
    "itemImage": null,
    "itemCategory": "Main Course",
    "itemType": "Veg",
    "itemStatus": "Available",
    "itemRating": 4.5,
    "menuId": 1
  }
  // ... more items
]
```

**prisma/seed-data/reservations.json**
```json
[
  {
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice.smith@example.com",
    "contact": "1234567890",
    "numberOfGuests": 2,
    "specialRequests": "Window seat",
    "reservationTime": "2024-07-02T19:00:00Z",
    "tableId": null,
    "restaurantId": 1,
    "status": "Booked"
  }
  // ... more reservations
]
```

### 2. Create a Seed Script

**prisma/seed.js**
```js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Read JSON files
  const menuItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data', 'menuItems.json')));
  const reservations = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data', 'reservations.json')));

  // Insert Menu Items
  for (const item of menuItems) {
    await prisma.menuItem.create({ data: item });
  }

  // Insert Reservations
  for (const reservation of reservations) {
    await prisma.reservation.create({ data: reservation });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 3. Configure Prisma to Use Your Seed Script

In your `package.json` (inside `back-end/`), add:
```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

### 4. Run the Seed Command

From your `back-end/` directory, run:
```sh
npx prisma db seed
```

---

This approach makes it easy to update your seed data and keep your development environment consistent. 

# Advanced Redis Features for Restofy

Redis is incredibly powerful and can do much more than just caching. Here are advanced Redis features that would be valuable for the Restofy project:

## 1. Session Management
- **Store user sessions** instead of using JWT tokens or database sessions.
- **Automatic expiry** for inactive sessions.
- **Distributed sessions** across multiple server instances.

```js
// Store session
await redisClient.setEx(`session:${sessionId}`, 3600, JSON.stringify(userData));

// Get session
const session = await redisClient.get(`session:${sessionId}`);
```

## 2. Rate Limiting
- **Track API requests per user/IP** to prevent abuse.
- **Sliding window** or **fixed window** rate limiting.
- **Different limits** for different endpoints.

```js
// Rate limiting middleware
const requests = await redisClient.incr(`rate_limit:${userId}:${endpoint}`);
if (requests === 1) await redisClient.expire(`rate_limit:${userId}:${endpoint}`, 60);
if (requests > 10) return res.status(429).json({ error: "Rate limit exceeded" });
```

## 3. Real-Time Features (Pub/Sub)
- **Live order updates** to kitchen staff and waiters.
- **Real-time table status** changes.
- **Instant notifications** when orders are ready.

```js
// Publisher (when order status changes)
await redisClient.publish('order_updates', JSON.stringify({ orderId, status }));

// Subscriber (in a separate process)
redisClient.subscribe('order_updates', (message) => {
  // Send to connected clients via WebSocket
});
```

## 4. Job Queues
- **Background tasks** like sending emails, generating reports.
- **Order processing** with retry logic.
- **Analytics calculations** that don't need to be real-time.

```js
// Add job to queue
await redisClient.lpush('email_queue', JSON.stringify({ to, subject, body }));

// Process jobs (in worker process)
const job = await redisClient.brpop('email_queue', 0);
```

## 5. Distributed Locks
- **Prevent race conditions** when multiple servers update the same data.
- **Ensure only one process** can update a bill at a time.

```js
// Acquire lock
const lockKey = `lock:bill:${billId}`;
const acquired = await redisClient.set(lockKey, 'locked', 'PX', 5000, 'NX');
if (!acquired) throw new Error('Bill is being updated by another process');
```

## 6. Analytics & Metrics
- **Track daily/weekly/monthly sales** with atomic counters.
- **Monitor peak hours** with time-series data.
- **User activity tracking**.

```js
// Increment daily sales
await redisClient.incrBy(`sales:daily:${date}`, amount);

// Track peak hours
await redisClient.zincrby('peak_hours', 1, hour);
```

## 7. Search & Filtering
- **Fast search** across restaurants, menu items.
- **Geospatial queries** for nearby restaurants.
- **Tag-based filtering**.

```js
// Store restaurant with geospatial data
await redisClient.geoadd('restaurants', longitude, latitude, restaurantId);

// Find restaurants within 5km
const nearby = await redisClient.georadius('restaurants', userLng, userLat, 5, 'km');
```

## 8. Leaderboards & Rankings
- **Top-selling dishes** across restaurants.
- **Most popular restaurants**.
- **Customer loyalty rankings**.

```js
// Update dish popularity
await redisClient.zincrby('popular_dishes', 1, dishId);

// Get top 10 dishes
const topDishes = await redisClient.zrevrange('popular_dishes', 0, 9);
```

## 9. Temporary Data Storage
- **Shopping carts** for online ordering.
- **Draft orders** that expire if not completed.
- **Temporary user preferences**.

```js
// Store cart with expiry
await redisClient.setEx(`cart:${userId}`, 3600, JSON.stringify(cartItems));
```

## 10. Caching Strategies
- **Cache warming** (pre-populate cache with popular data).
- **Cache invalidation patterns** (write-through, write-behind).
- **Multi-level caching** (Redis + in-memory).

## Recommended Implementation Priority for Restofy

### High Priority:
1. **Session Management** - Replace JWT with Redis sessions
2. **Rate Limiting** - Protect your API from abuse
3. **Real-Time Updates** - Live order tracking for staff
4. **Job Queues** - Background email notifications, report generation

### Medium Priority:
5. **Analytics** - Track sales, peak hours, popular items
6. **Distributed Locks** - Prevent race conditions in high-traffic scenarios
7. **Search** - Fast restaurant/menu search

### Future Enhancements:
8. **Leaderboards** - Popular dishes, top restaurants
9. **Geospatial** - Find nearby restaurants
10. **Advanced Caching** - Multi-level, cache warming

## Implementation Strategy

1. **Start with caching** (already implemented)
2. **Add session management** (replace JWT)
3. **Implement rate limiting** (security)
4. **Add real-time features** (user experience)
5. **Scale with job queues** (performance)

Redis can transform Restofy from a simple CRUD API to a real-time, scalable platform! 

## Event-Driven Architecture (Planned)

To further scale and decouple the Restofy platform, we plan to adopt an **event-driven architecture** using a message broker such as **Kafka** or **RabbitMQ**. This will enable microservices (e.g., notifications, analytics, inventory, audit logs) to communicate via events rather than direct REST calls.

### Rationale
- **Loose coupling:** Services interact via events, not direct API calls.
- **Scalability:** Easily add new services (e.g., analytics, notifications) that react to events.
- **Resilience:** Services can operate independently and recover from failures more easily.

### Example Use Cases
- When an order is placed, the backend publishes an `OrderCreated` event. The notification service listens for this event and sends a confirmation email/SMS.
- Analytics service listens for `ReservationCreated` and `OrderCompleted` events to update dashboards in real time.
- Inventory service updates stock levels in response to order events.

### Sample Architecture Diagram

```mermaid
flowchart LR
  FE[Frontend (React/Tailwind)]
  BE[Backend (Node.js/Express)]
  SB[Spring Boot Service]
  MQ[Message Broker (Kafka/RabbitMQ)]
  DB1[(DB)]
  DB2[(DB)]
  FE -- REST --> BE
  BE -- REST --> DB1
  BE -- Publishes Events --> MQ
  SB -- Subscribes to Events --> MQ
  SB -- REST/DB --> DB2
```

### Implementation Notes
- The message broker will be run via Docker Compose for local development, and as a managed/cloud service or self-hosted in production.
- Each microservice will connect to the broker to publish/subscribe to relevant events.
- Authentication and security will be enforced for all broker connections and service APIs.

---

# Production-Level App.js Refactoring

### Current Issues in app.js
1. **Security Vulnerabilities**
   - Missing Helmet for security headers
   - Basic CORS configuration
   - No request size limits
   - Missing security middleware

2. **Poor Middleware Organization**
   - Global authentication after specific routes
   - No environment-specific configuration
   - Missing health checks
   - No proper logging setup

3. **Scalability Issues**
   - Hard-coded route paths
   - No API versioning
   - Mixed concerns in single file

### Production-Level Improvements Needed

#### 1. Security Hardening
```javascript
// Add Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Proper CORS configuration
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours
}));

// Request size limits
app.use(express.json({ 
  limit: '10mb',
  strict: true 
}));
```

#### 2. Enhanced Rate Limiting
```javascript
// Different rate limits for different endpoints
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
}));

app.use('/api/auth/signup', rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: 'Too many signup attempts'
}));
```

#### 3. Health Checks & Monitoring
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    memory: process.memoryUsage(),
  });
});

// Readiness check for Kubernetes/Docker
app.get('/ready', async (req, res) => {
  try {
    // Add database connectivity check
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready' });
  }
});
```

#### 4. Proper Logging Setup
```javascript
// Production logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { 
    stream: { write: (message) => logger.info(message.trim()) }
  }));
} else {
  app.use(morgan('dev'));
}
```

#### 5. Route Organization
```javascript
// Modular route structure
app.use('/api', routes); // Central route handler

// Instead of individual route imports in app.js
// Create routes/index.js for better organization
```

#### 6. Error Handling & Graceful Shutdown
```javascript
// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});
```

#### 7. Configuration Management
```javascript
// Environment-specific configuration
const config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
  },
};
```

### Migration Priority
1. **Phase 1**: Add security middleware (Helmet, proper CORS)
2. **Phase 2**: Implement health checks and monitoring
3. **Phase 3**: Reorganize routes into modular structure
4. **Phase 4**: Add proper error handling and graceful shutdown
5. **Phase 5**: Implement environment-specific configurations

### Benefits of Refactoring
- **Security**: Production-ready security headers and protections
- **Monitoring**: Health checks for load balancers and orchestrators
- **Scalability**: Modular route organization for microservices migration
- **Reliability**: Proper error handling and graceful shutdown
- **Maintainability**: Clean separation of concerns and configuration management

### Tools to Add
- `helmet` - Security headers
- `compression` - Response compression
- `express-rate-limit` - Advanced rate limiting
- `express-slow-down` - Request throttling
- `winston` - Production logging
- `dotenv` - Environment configuration

### Complete Production-Level Implementation Code

#### Enhanced Security Middleware
```javascript
// filepath: src/shared/middleware/security.js
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const { body, validationResult } = require('express-validator');

// Request size limiter
const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length'));
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large'
    });
  }
  next();
};

// IP whitelist middleware (if needed)
const ipWhitelist = (allowedIPs) => (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (allowedIPs.includes(clientIP)) {
    next();
  } else {
    res.status(403).json({ error: 'IP not allowed' });
  }
};

// Request sanitization
const sanitizeRequest = [
  body('*').trim().escape(),
];

// Advanced rate limiting with different strategies
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, User-Agent: ${req.get('User-Agent')}`);
    res.status(429).json({ error: message });
  }
});

module.exports = {
  requestSizeLimiter,
  ipWhitelist,
  sanitizeRequest,
  createRateLimit,
};
```

#### Production-Ready Error Handling
```javascript
// filepath: src/shared/errors/index.js
class BaseError extends Error {
  constructor(message, statusCode, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class ValidationError extends BaseError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 400);
    this.details = details;
    this.type = 'ValidationError';
  }
}

class NotFoundError extends BaseError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'NotFoundError';
  }
}

class UnauthorizedError extends BaseError {
  constructor(message = 'Authentication required') {
    super(message, 401);
    this.type = 'UnauthorizedError';
  }
}

class ForbiddenError extends BaseError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403);
    this.type = 'ForbiddenError';
  }
}

class ConflictError extends BaseError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.type = 'ConflictError';
  }
}

class DatabaseError extends BaseError {
  constructor(message = 'Database operation failed') {
    super(message, 500);
    this.type = 'DatabaseError';
  }
}

// Error handler middleware
const errorHandler = (error, req, res, next) => {
  const logger = require('../utils/logger');
  
  // Log error details
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: res.locals.user?.userId,
  });

  // Handle known errors
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        type: error.type || error.constructor.name,
        message: error.message,
        details: error.details || undefined,
      },
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  // Handle Prisma errors
  if (error.code && error.code.startsWith('P')) {
    return handlePrismaError(error, res);
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        type: 'ValidationError',
        message: 'Validation failed',
        details: error.details,
      },
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        type: 'UnauthorizedError',
        message: 'Invalid token',
      },
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      type: 'InternalServerError',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};

const handlePrismaError = (error, res) => {
  switch (error.code) {
    case 'P2002':
      return res.status(409).json({
        success: false,
        error: {
          type: 'ConflictError',
          message: 'A record with this data already exists',
          field: error.meta?.target,
        },
      });
    case 'P2025':
      return res.status(404).json({
        success: false,
        error: {
          type: 'NotFoundError',
          message: 'Record not found',
        },
      });
    default:
      return res.status(500).json({
        success: false,
        error: {
          type: 'DatabaseError',
          message: 'Database operation failed',
        },
      });
  }
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      type: 'NotFoundError',
      message: `Route ${req.method} ${req.path} not found`,
    },
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  BaseError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  DatabaseError,
  errorHandler,
  notFoundHandler,
};
```

#### Advanced Logging System
```javascript
// filepath: src/shared/utils/logger.js
const winston = require('winston');
const path = require('path');

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...(stack && { stack }),
      ...meta,
    });
  })
);

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'restofy-api',
    version: process.env.npm_package_version || '1.0.0',
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' 
        ? logFormat 
        : winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
    }),
  ],
});

// Add file transports for production
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));

  logger.add(new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 10,
  }));
}

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: res.locals.user?.userId,
    };

    if (res.statusCode >= 400) {
      logger.warn('HTTP request completed with error', logData);
    } else {
      logger.info('HTTP request completed', logData);
    }
  });

  next();
};

module.exports = { logger, requestLogger };
```

#### Comprehensive Configuration Management
```javascript
// filepath: src/config/index.js
const path = require('path');
require('dotenv').config();

const validateEnvVar = (name, defaultValue = null, required = true) => {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value || defaultValue;
};

const config = {
  app: {
    name: 'Restofy API',
    env: validateEnvVar('NODE_ENV', 'development', false),
    port: parseInt(validateEnvVar('PORT', '3000', false)),
    host: validateEnvVar('HOST', '0.0.0.0', false),
    maxRequestSize: validateEnvVar('MAX_REQUEST_SIZE', '10mb', false),
    cookieSecret: validateEnvVar('COOKIE_SECRET'),
    trustProxy: validateEnvVar('TRUST_PROXY', 'false', false) === 'true',
  },

  database: {
    url: validateEnvVar('DATABASE_URL'),
    maxConnections: parseInt(validateEnvVar('DB_MAX_CONNECTIONS', '10', false)),
    connectionTimeout: parseInt(validateEnvVar('DB_CONNECTION_TIMEOUT', '30000', false)),
  },

  redis: {
    url: validateEnvVar('REDIS_URL', 'redis://localhost:6379', false),
    ttl: parseInt(validateEnvVar('REDIS_TTL', '300', false)), // 5 minutes
    maxRetries: parseInt(validateEnvVar('REDIS_MAX_RETRIES', '3', false)),
  },

  auth: {
    jwtSecret: validateEnvVar('JWT_SECRET'),
    jwtExpiration: validateEnvVar('JWT_EXPIRATION', '7d', false),
    jwtRefreshExpiration: validateEnvVar('JWT_REFRESH_EXPIRATION', '30d', false),
    bcryptRounds: parseInt(validateEnvVar('BCRYPT_ROUNDS', '12', false)),
  },

  cors: {
    origins: validateEnvVar('CORS_ORIGINS', 'http://localhost:3000', false)
      .split(',')
      .map(origin => origin.trim()),
    credentials: validateEnvVar('CORS_CREDENTIALS', 'true', false) === 'true',
  },

  rateLimit: {
    windowMs: parseInt(validateEnvVar('RATE_LIMIT_WINDOW_MS', '900000', false)), // 15 minutes
    max: parseInt(validateEnvVar('RATE_LIMIT_MAX', '100', false)),
    authWindowMs: parseInt(validateEnvVar('AUTH_RATE_LIMIT_WINDOW_MS', '900000', false)), // 15 minutes
    authMax: parseInt(validateEnvVar('AUTH_RATE_LIMIT_MAX', '5', false)),
  },

  logging: {
    level: validateEnvVar('LOG_LEVEL', 'info', false),
    maxFiles: parseInt(validateEnvVar('LOG_MAX_FILES', '10', false)),
    maxSize: validateEnvVar('LOG_MAX_SIZE', '5MB', false),
  },

  monitoring: {
    enableMetrics: validateEnvVar('ENABLE_METRICS', 'false', false) === 'true',
    metricsPort: parseInt(validateEnvVar('METRICS_PORT', '9090', false)),
  },

  email: {
    host: validateEnvVar('EMAIL_HOST', null, false),
    port: parseInt(validateEnvVar('EMAIL_PORT', '587', false)),
    user: validateEnvVar('EMAIL_USER', null, false),
    password: validateEnvVar('EMAIL_PASSWORD', null, false),
    from: validateEnvVar('EMAIL_FROM', null, false),
  },

  aws: {
    accessKeyId: validateEnvVar('AWS_ACCESS_KEY_ID', null, false),
    secretAccessKey: validateEnvVar('AWS_SECRET_ACCESS_KEY', null, false),
    region: validateEnvVar('AWS_REGION', 'us-east-1', false),
    s3Bucket: validateEnvVar('AWS_S3_BUCKET', null, false),
  },
};

// Validate critical configurations
if (config.app.env === 'production') {
  const criticalVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'COOKIE_SECRET',
  ];
  
  criticalVars.forEach(varName => {
    if (!process.env[varName]) {
      throw new Error(`Critical environment variable ${varName} is missing in production`);
    }
  });
}

module.exports = config;
```

#### Advanced Route Organization
```javascript
// filepath: src/routes/index.js
const express = require('express');
const { authenticate } = require('../shared/middleware/auth');
const { createRateLimit } = require('../shared/middleware/security');
const { requestLogger } = require('../shared/utils/logger');

// Route imports
const authRoutes = require('../domains/auth/router');
const publicRoutes = require('./public');
const v1Routes = require('./v1');
const adminRoutes = require('./admin');

const router = express.Router();

// Global middleware for all API routes
router.use(requestLogger);

// Public routes (no authentication required)
router.use('/public', createRateLimit(15 * 60 * 1000, 50, 'Too many public requests'), publicRoutes);

// Authentication routes
router.use('/auth', createRateLimit(15 * 60 * 1000, 10, 'Too many auth requests'), authRoutes);

// Protected API routes
router.use('/v1', authenticate, v1Routes);

// Admin routes (require admin role)
router.use('/admin', authenticate, adminRoutes);

// API documentation routes (if using Swagger)
if (process.env.NODE_ENV !== 'production') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('../docs/swagger.json');
  
  router.use('/docs', swaggerUi.serve);
  router.get('/docs', swaggerUi.setup(swaggerDocument));
}

module.exports = router;
```

#### Health Check System
```javascript
// filepath: src/shared/utils/healthCheck.js
const { PrismaClient } = require('@prisma/client');
const Redis = require('ioredis');
const config = require('../../config');

const prisma = new PrismaClient();
const redis = new Redis(config.redis.url);

const checkDatabase = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', message: 'Database connection successful' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
};

const checkRedis = async () => {
  try {
    await redis.ping();
    return { status: 'healthy', message: 'Redis connection successful' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
};

const checkExternalServices = async () => {
  // Add checks for external services like payment gateways, email services, etc.
  return { status: 'healthy', message: 'All external services operational' };
};

const getHealthStatus = async () => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    externalServices: await checkExternalServices(),
  };

  const isHealthy = Object.values(checks).every(check => check.status === 'healthy');

  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    checks,
  };
};

module.exports = { getHealthStatus };
```

#### Production Dockerfile
```dockerfile
# filepath: Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy necessary files
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
```

#### Docker Compose for Production
```yaml
# filepath: docker-compose.prod.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/restofy
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - COOKIE_SECRET=${COOKIE_SECRET}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - restofy-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=restofy
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    networks:
      - restofy-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - restofy-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped
    networks:
      - restofy-network

volumes:
  postgres_data:
  redis_data:

networks:
  restofy-network:
    driver: bridge
```

#### Environment Variables Template
```bash
# filepath: .env.example
# Application
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
MAX_REQUEST_SIZE=10mb
TRUST_PROXY=true

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/restofy
DB_MAX_CONNECTIONS=10
DB_CONNECTION_TIMEOUT=30000

# Redis
REDIS_URL=redis://localhost:6379
REDIS_TTL=300
REDIS_MAX_RETRIES=3

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d
JWT_REFRESH_EXPIRATION=30d
BCRYPT_ROUNDS=12
COOKIE_SECRET=your-super-secret-cookie-key

# CORS
CORS_ORIGINS=http://localhost:3000,https://your-domain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX=5

# Logging
LOG_LEVEL=info
LOG_MAX_FILES=10
LOG_MAX_SIZE=5MB

# Monitoring
ENABLE_METRICS=true
METRICS_PORT=9090

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@restofy.com

# AWS (Optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=restofy-uploads
```

### Implementation Checklist

#### Phase 1: Security & Foundation
- [ ] Add Helmet middleware
- [ ] Implement proper CORS configuration
- [ ] Add request size limits
- [ ] Create comprehensive error handling
- [ ] Set up production logging

#### Phase 2: Monitoring & Health
- [ ] Implement health check endpoints
- [ ] Add request/response logging
- [ ] Set up performance monitoring
- [ ] Add graceful shutdown handling

#### Phase 3: Configuration & Deployment
- [ ] Create environment-specific configs
- [ ] Add Docker configuration
- [ ] Set up CI/CD pipeline
- [ ] Configure load balancer/reverse proxy

#### Phase 4: Advanced Features
- [ ] Implement caching strategies
- [ ] Add job queue system
- [ ] Set up real-time features
- [ ] Add comprehensive testing

This complete production-level implementation provides enterprise-grade security, monitoring, error handling, and deployment capabilities for the Restofy platform.