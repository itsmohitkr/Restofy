# Restofy Backend

## Overview
Restofy is a robust, production-ready restaurant management backend built with Node.js, Express, Prisma ORM, and PostgreSQL. It provides secure, scalable APIs for restaurant owners to manage restaurants, tables, menus, reservations, and staff, with authentication, RBAC, validation, and logging.

---

## Features
- **Authentication & RBAC**: JWT-based login, role-based access for owners and staff
- **Restaurant Management**: CRUD for restaurants, tables, menus, menu items, and reservations
- **Validation**: Joi-based request validation for all endpoints
- **Centralized Error Handling**: Consistent error responses and logging
- **Rate Limiting**: Protects APIs from abuse
- **Logging**: Winston-based logging to files and console
- **Testing**: Jest and Supertest for unit and integration tests
- **Prisma ORM**: Type-safe DB access and migrations
- **Extensible**: Modular Domain-Driven Design architecture

---

## Backend Folder Structure

```
back-end/
├── infrastructure/               # External dependencies & services
│   └── database/
│       └── prisma/              # Prisma schema & migrations
│           ├── client.js        # Prisma client configuration
│           ├── schema.prisma    # Database schema
│           └── migrations/      # Database migrations
├── logs/                        # Winston log files (generated)
├── tests/                       # Jest/Supertest tests (planned)
├── src/
│   ├── domains/                 # Business domains (DDD approach)
│   │   ├── authentication/      # Auth logic (signup, login, JWT)
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.router.js
│   │   │   └── auth.service.js
│   │   ├── restaurant/          # Restaurant CRUD
│   │   │   ├── restaurant.controller.js
│   │   │   ├── restaurant.router.js
│   │   │   └── restaurant.service.js
│   │   ├── menu/                # Menu management
│   │   │   ├── menu.controller.js
│   │   │   ├── menu.router.js
│   │   │   └── menu.service.js
│   │   ├── menuItem/            # Menu item management
│   │   │   ├── menuItem.controller.js
│   │   │   ├── menuItem.router.js
│   │   │   └── menuItem.service.js
│   │   ├── tables/              # Table management
│   │   │   ├── table.controller.js
│   │   │   ├── table.router.js
│   │   │   └── table.service.js
│   │   ├── reservation/         # Reservation management
│   │   │   ├── reservation.controller.js
│   │   │   ├── reservation.router.js
│   │   │   └── reservation.service.js
│   │   ├── order/               # Order management
│   │   │   ├── order.controller.js
│   │   │   ├── order.router.js
│   │   │   └── order.service.js
│   │   ├── bill/                # Bill management
│   │   │   ├── bill.controller.js
│   │   │   ├── bill.router.js
│   │   │   └── bill.service.js
│   │   ├── payment/             # Payment management
│   │   │   ├── payment.controller.js
│   │   │   ├── payment.router.js
│   │   │   └── payment.service.js
│   │   └── user/                # User management
│   │       ├── user.controller.js
│   │       ├── user.router.js
│   │       └── user.service.js
│   │
│   ├── routes/                  # API routing layer
│   │   ├── index.js             # Main router
│   │   ├── v1/                  # API version 1
│   │   │   └── index.js         # V1 main router with middleware
│   │   ├── public/              # Public routes (planned)
│   │   │   └── index.js         # Health checks, docs
│   │   └── admin/               # Admin routes
│   │       └── admin.router.js
│   │
│   ├── shared/                  # Shared across domains
│   │   ├── middleware/          # Middleware functions
│   │   │   ├── restrictToLoggedInUser.js  # Authentication middleware
│   │   │   ├── checkRestaurantOwnership.js # Authorization middleware
│   │   │   ├── validate.js      # Request validation
│   │   │   ├── validateParam.js # Parameter validation
│   │   │   └── requireBody.js   # Body requirement check
│   │   ├── security/            # Security middleware
│   │   │   └── apiLimiter.js    # Rate limiting
│   │   ├── error/               # Error handling
│   │   │   ├── errorHandler.js  # Global error handler
│   │   │   ├── asyncErrorBoundary.js # Async error wrapper
│   │   │   ├── pathNotFound.js  # 404 handler
│   │   │   └── methodNotAllowed.js # 405 handler
│   │   └── utils/               # Shared utilities
│   │       └── helper/          # Helper functions
│   │           ├── responseHelpers.js # Response formatters
│   │           └── responseBody.js    # Response body utilities
│   │
│   ├── reqBodyValidation/       # Joi validation schemas
│   │   ├── auth.validation.js   # Authentication validation
│   │   ├── restaurant.validation.js # Restaurant validation
│   │   ├── menu.validation.js   # Menu validation
│   │   ├── menuItem.validation.js # Menu item validation
│   │   ├── table.validation.js  # Table validation
│   │   ├── reservation.validation.js # Reservation validation
│   │   ├── order.validation.js  # Order validation
│   │   ├── bill.validation.js   # Bill validation
│   │   ├── payment.validation.js # Payment validation
│   │   └── user.validation.js   # User validation
│   │
│   ├── app.js                   # Express app setup & middleware
│   └── server.js                # Server startup & port configuration
│
├── admin/                       # Admin panel (separate from API)
│   └── admin.router.js          # Admin route definitions
├── BLOCKERS.md                  # Architectural decisions & blockers
├── LEARNING_GUIDE.md            # Learning resources and notes  
├── future.md                    # Future plans & feature roadmap
├── env.example                  # Environment variable template
├── jest.config.js               # Jest testing configuration
├── package.json                 # NPM dependencies and scripts
├── package-lock.json            # NPM lockfile
└── README.md                    # Project documentation
```

---

## Architecture Overview

### **Domain-Driven Design (DDD)**
The project follows DDD principles with clear separation of concerns:

- **`domains/`**: Each business domain (restaurant, menu, orders, etc.) is self-contained with its own controllers, services, and routers
- **`routes/`**: API routing layer with versioning support (v1, public, admin)
- **`shared/`**: Cross-cutting concerns like middleware, utilities, and error handling
- **`infrastructure/`**: External dependencies like database connections

### **Current API Structure**
- **Main Routes**: `/api/` - All API routes go through main router
- **V1 Routes**: `/api/v1/` - Versioned API routes with restaurant middleware
- **Auth Routes**: `/api/auth/` - Authentication endpoints (signup, login)
- **Admin Routes**: `/api/admin/` - Administrative functions

### **Middleware Architecture**
- **Authentication**: JWT-based user authentication (`restrictToLoggedInUser.js`)
- **Authorization**: Restaurant ownership validation (`checkRestaurantOwnership.js`)
- **Validation**: Joi-based request validation (`validate.js`, `validateParam.js`)
- **Security**: Rate limiting (`apiLimiter.js`)
- **Error Handling**: Centralized error processing (`errorHandler.js`)

---

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Joi validation schemas
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: express-rate-limit, CORS
- **Testing**: Jest, Supertest (planned)

---

## Current Route Structure

### **Main API Entry Point**
```
/api/
├── /auth                        # Authentication (public)
│   ├── POST /signup            # User registration
│   ├── POST /login             # User login
│   └── GET /verifyToken        # Token verification
│
├── /v1                         # Version 1 API (protected)
│   └── /restaurants            # Restaurant management
│       ├── GET /               # List user's restaurants
│       ├── POST /              # Create new restaurant
│       ├── GET /:id            # Get specific restaurant
│       ├── PUT /:id            # Update restaurant
│       ├── DELETE /:id         # Delete restaurant
│       │
│       └── /:restaurantId/     # Restaurant-scoped resources
│           ├── /table          # Table management
│           ├── /menu           # Menu management
│           ├── /reservations   # Reservation management
│           └── /menu/:menuId/menuItem # Menu item management
│
└── /admin                      # Admin functions (protected)
    └── [Admin routes]
```

---

## Request/Response Flow

### **Authentication Flow**
1. User calls `POST /api/auth/signup` or `POST /api/auth/login`
2. Server validates credentials and returns JWT token
3. Token stored in HTTP-only cookie
4. Protected routes validate JWT via `restrictToLoggedInUser.js`
5. User info stored in `res.locals.user`

### **Restaurant-Scoped Resource Access**
1. User accesses `/api/v1/restaurants/:restaurantId/*`
2. `validateParam("restaurantId")` validates the restaurant ID
3. `isRestaurantExist` checks if restaurant exists
4. `checkRestaurantOwnership` verifies user owns/can access restaurant
5. Route handler processes the request

---

## Security & Middleware

### **Authentication & Authorization**
- **JWT Authentication**: All v1 routes require valid JWT token
- **Restaurant Ownership**: Users can only access their own restaurants
- **Parameter Validation**: All route parameters validated for type/format
- **Request Validation**: All request bodies validated with Joi schemas

### **Security Features**
- Rate limiting to prevent API abuse
- CORS protection for cross-origin requests
- Request body validation to prevent injection
- Centralized error handling to prevent data leaks
- HTTP-only cookies for secure token storage

---

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Restofy/back-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp env.example .env
   # Edit .env with your database URL and other configs
   ```

4. **Setup database:**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the server:**
   ```bash
   npm run dev        # Development mode
   npm start          # Production mode
   ```

---

## Environment Variables
Key environment variables (see `env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - JWT token expiration time
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

---

## Database Schema (Prisma)
- **RestaurantOwner**: ownerId, ownerName, ownerEmail, ...
- **Restaurant**: restaurantId, restaurantName, ownerId, ...
- **Table**: id, tableName, tableCapacity, restaurantId, ...
- **Reservation**: id, firstName, lastName, reservationTime, tableId, restaurantId, ...
- **Menu**: id, restaurantId, ...
- **MenuItem**: id, itemName, itemPrice, menuId, ...
- **RestaurantStaff**: id, staffName, staffEmail, staffRole, restaurantId, ...

See [`infrastructure/database/prisma/schema.prisma`](./infrastructure/database/prisma/schema.prisma) for full details.

---

## API Documentation
All endpoints are prefixed with `/api/v1`.

### Auth
- `POST   /api/auth/signup` — Register a new user (owner)
- `POST   /api/auth/login` — Login, returns JWT cookie
- `GET    /api/auth/verifyToken` — Verify JWT

### Restaurants
- `GET    /api/v1/restaurants` — List all restaurants for the authenticated user
- `POST   /api/v1/restaurants` — Create a new restaurant
- `GET    /api/v1/restaurants/:restaurantId` — Get a specific restaurant
- `PUT    /api/v1/restaurants/:restaurantId` — Update a restaurant
- `DELETE /api/v1/restaurants/:restaurantId` — Delete a restaurant

### Tables
- `GET    /api/v1/restaurants/:restaurantId/table` — List all tables for a restaurant
- `POST   /api/v1/restaurants/:restaurantId/table` — Create a table
- `GET    /api/v1/restaurants/:restaurantId/table/:tableId` — Get a specific table
- `PUT    /api/v1/restaurants/:restaurantId/table/:tableId` — Update a table
- `DELETE /api/v1/restaurants/:restaurantId/table/:tableId` — Delete a table

### Menus
- `POST   /api/v1/restaurants/:restaurantId/menu` — Create a menu
- `GET    /api/v1/restaurants/:restaurantId/menu/:menuId` — Get a menu
- `DELETE /api/v1/restaurants/:restaurantId/menu/:menuId` — Delete a menu

### Menu Items
- `GET    /api/v1/restaurants/:restaurantId/menu/:menuId/menuItem` — List menu items
- `POST   /api/v1/restaurants/:restaurantId/menu/:menuId/menuItem` — Create a menu item
- `GET    /api/v1/restaurants/:restaurantId/menu/:menuId/menuItem/:menuItemId` — Get a menu item
- `PUT    /api/v1/restaurants/:restaurantId/menu/:menuId/menuItem/:menuItemId` — Update a menu item
- `DELETE /api/v1/restaurants/:restaurantId/menu/:menuId/menuItem/:menuItemId` — Delete a menu item

### Reservations
- `GET    /api/v1/restaurants/:restaurantId/reservations` — List reservations
- `POST   /api/v1/restaurants/:restaurantId/reservations` — Create a reservation
- `GET    /api/v1/restaurants/:restaurantId/reservations/:reservationId` — Get a reservation
- `PUT    /api/v1/restaurants/:restaurantId/reservations/:reservationId` — Update a reservation
- `DELETE /api/v1/restaurants/:restaurantId/reservations/:reservationId` — Delete a reservation

### Orders
- `POST   /api/v1/restaurants/:restaurantId/reservations/:reservationId/order` — Create an order
- `GET    /api/v1/restaurants/:restaurantId/reservations/:reservationId/order/:orderId` — Get an order
- `PUT    /api/v1/restaurants/:restaurantId/reservations/:reservationId/order/:orderId` — Update an order

### Bills
- `POST   /api/v1/restaurants/:restaurantId/reservations/:reservationId/order/:orderId/bill` — Create a bill
- `GET    /api/v1/restaurants/:restaurantId/reservations/:reservationId/order/:orderId/bill/:billId` — Get a bill

### Payments
- `POST   /api/v1/restaurants/:restaurantId/reservations/:reservationId/order/:orderId/bill/:billId/payment` — Make a payment

---

## Security & Middleware

### **Authentication Flow**
1. User signs up/logs in → receives JWT token
2. Token stored in HTTP-only cookie
3. Every protected route validates JWT
4. User info stored in `res.locals.user`

### **Authorization (RBAC)**
- **OWNER**: Full access to their restaurants
- **MANAGER**: Full access within assigned restaurants
- **STAFF**: Limited access (read + specific updates)
- **ADMIN**: Administrative functions

### **Security Features**
- JWT-based authentication
- Role-based access control
- Request validation with Joi
- Rate limiting (prevent API abuse)
- CORS protection
- Security headers with Helmet
- Centralized error handling

---

## Request Validation
All create/update endpoints validate input using Joi schemas located in `src/reqBodyValidation/`.

---

## Error Handling & Logging
- **Centralized Error Handling**: All errors processed by `errorHandler.js`
- **Async Error Boundary**: Automatic async error catching
- **Consistent Error Responses**: Standardized error format across API
- **Request Validation**: Joi validation with detailed error messages
- **HTTP Status Codes**: Proper status codes for different error types

---

## Validation Strategy
All endpoints use Joi schemas from `reqBodyValidation/`:
- **Request Body Validation**: Validates POST/PUT request data
- **Parameter Validation**: Validates URL parameters (IDs, etc.)
- **Required Field Checking**: Ensures required fields are present
- **Data Type Validation**: Enforces correct data types
- **Business Rule Validation**: Custom validation rules

---

## Best Practices Implemented
- **Domain-Driven Design**: Clear business domain separation
- **Security First**: Authentication and authorization on all protected routes
- **Consistent API Design**: Standardized request/response patterns
- **Error Handling**: Comprehensive error catching and reporting
- **Validation**: Input validation on all endpoints
- **Modular Architecture**: Easy to maintain and extend

---

## Future Enhancements
See `future.md` for planned features:
- Unit and integration testing with Jest
- API documentation with Swagger
- Logging with Winston
- Caching with Redis
- File upload capabilities
- Email notifications
- Advanced RBAC with staff roles

---

## Contact
Author: Mohit Kumar