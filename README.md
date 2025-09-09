# Restofy - Restaurant Management Platform

## 🍽️ Overview
Restofy is a comprehensive, production-ready restaurant management platform built with modern technologies. It provides a complete solution for restaurant owners to manage their operations, including reservations, orders, payments, staff, and analytics.

## 🏗️ Architecture
- **Frontend**: React 19 with Material-UI, Vite build system
- **Backend**: Node.js/Express.js with Domain-Driven Design (DDD) architecture
- **Notification Service**: Event-driven microservice with RabbitMQ
- **Database**: PostgreSQL with Prisma ORM
- **Message Broker**: RabbitMQ for asynchronous communication
- **Authentication**: JWT-based with role-based access control (RBAC)

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

## 📁 Project Structure

```
Restofy/
├── back-end/                          # Node.js/Express Backend API
│   ├── src/
│   │   ├── domains/                   # Business Domains (DDD)
│   │   │   ├── analytics/             # Analytics & Reporting
│   │   │   ├── authentication/        # User Authentication
│   │   │   ├── bill/                  # Bill Management
│   │   │   ├── menu/                  # Menu Management
│   │   │   ├── menuItem/              # Menu Item Management
│   │   │   ├── order/                 # Order Management
│   │   │   ├── payment/               # Payment Processing
│   │   │   ├── profile/               # User Profile Management
│   │   │   ├── reservation/           # Reservation Management
│   │   │   ├── restaurant/            # Restaurant Management
│   │   │   ├── tables/                # Table Management
│   │   │   └── user/                  # User Management
│   │   ├── infrastructure/            # External Dependencies
│   │   │   ├── database/
│   │   │   │   ├── prisma/
│   │   │   │   └── redis/
│   │   │   ├── external-services/
│   │   │   └── monitoring/
│   │   ├── routes/                    # API Routing Layer
│   │   │   ├── index.js               # Main router
│   │   │   └── v1/
│   │   │       └── index.js           # V1 API routes
│   │   ├── shared/                    # Shared Components
│   │   │   ├── error/                 # Error Handling
│   │   │   ├── jobs/                  # Background Jobs
│   │   │   ├── middleware/            # Express Middleware
│   │   │   ├── queues/                # Message Queues
│   │   │   ├── security/              # Security Middleware
│   │   │   └── services/              # Shared Services
│   │   ├── utils/                     # Utilities
│   │   │   ├── constants/
│   │   │   ├── helper/
│   │   │   ├── logger.js
│   │   │   └── validation/            # Joi Validation Schemas
│   │   ├── admin/                     # Admin Panel
│   │   ├── app.js                     # Express App Setup
│   │   └── server.js                  # Server Entry Point
│   ├── tests/                         # Test Files
│   ├── logs/                          # Winston Log Files
│   ├── assests/                       # Assets
│   ├── .dockerignore
│   ├── .gitignore
│   ├── BLOCKERS.md                    # Development Notes
│   ├── LEARNING_GUIDE.md              # Learning Resources
│   ├── future.md                      # Future Plans
│   ├── env.example                    # Environment Template
│   ├── jest.config.js                 # Jest Configuration
│   ├── package.json
│   ├── package-lock.json
│   ├── dockerfile                     # Docker Configuration
│   └── README.md
│
├── front-end/                         # React Frontend Application
│   ├── src/
│   │   ├── AuthPage/                  # Authentication Pages
│   │   ├── Component/                 # Reusable Components
│   │   ├── Context/                   # React Context Providers
│   │   ├── Layout/                    # Page Layouts & Components
│   │   ├── assets/                    # Static Assets
│   │   ├── App.css
│   │   ├── App.jsx                    # Main App Component
│   │   └── main.jsx                   # React Entry Point
│   ├── public/                        # Public Assets
│   ├── .dockerignore
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── dockerfile                     # Docker Configuration
│   ├── nginx.conf                     # Nginx Configuration
│   └── vite.config.js                 # Vite Configuration
│
├── notification-service/              # Event-Driven Notification Service
│   ├── src/
│   │   ├── channel/                   # Notification Channels
│   │   ├── dispatcher/                # Message Dispatcher
│   │   ├── jobs/                      # Background Job Processors
│   │   ├── queues/                    # Message Queue Setup
│   │   ├── services/                  # Business Services
│   │   ├── utils/                     # Utilities
│   │   └── index.js                   # Service Entry Point
│   ├── prisma/                        # Database Schema
│   ├── .dockerignore
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── dockerfile                     # Docker Configuration
│   └── test.js
│
├── docker-compose.yml                 # Multi-Service Orchestration
├── package.json                       # Root Package Configuration
├── package-lock.json
└── README.md                          # This File
```

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

## 🛠️ Technologies Used

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL with Prisma ORM 6.11.1
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Validation**: Joi 17.13.3
- **Security**: bcrypt 6.0.0, express-rate-limit 7.5.1
- **Message Queue**: RabbitMQ (amqplib 0.10.8)
- **Email**: Nodemailer 7.0.3
- **Logging**: Winston 3.17.0
- **Testing**: Jest 30.0.2, Supertest 7.1.1

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) 7.3.1
- **Routing**: React Router DOM 7.8.2
- **HTTP Client**: Axios 1.11.0
- **Charts**: Recharts 3.1.2
- **Styling**: Emotion (CSS-in-JS)

### Notification Service
- **Runtime**: Node.js 18+
- **Message Queue**: RabbitMQ (amqplib 0.10.3)
- **Database**: PostgreSQL with Prisma ORM 6.14.0
- **Email**: Nodemailer 6.9.8
- **PDF Generation**: PDFKit 0.17.1

### DevOps & Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (for frontend)
- **Process Management**: PM2 (production)

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

## 🚀 API Endpoints

### Base URL: `/api`

### 🔐 Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | User registration | ❌ |
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/logout` | User logout | ✅ |
| GET | `/auth/verifyToken` | Verify JWT token | ✅ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password with token | ❌ |

### 👤 Profile Endpoints (`/api/v1/profile`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user profile | ✅ |
| PUT | `/profile` | Update user profile | ✅ |

### 🏪 Restaurant Management (`/api/v1/restaurants`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/restaurants` | Get all user's restaurants | ✅ |
| POST | `/restaurants` | Create new restaurant | ✅ |
| GET | `/restaurants/:restaurantId` | Get specific restaurant | ✅ |
| PUT | `/restaurants/:restaurantId` | Update restaurant | ✅ |
| DELETE | `/restaurants/:restaurantId` | Delete restaurant | ✅ |

### 📊 Analytics (`/api/v1/restaurants/:restaurantId/analytics`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics` | Get restaurant analytics | ✅ |

### 👥 User Management (`/api/v1/restaurants/:restaurantId/user`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user` | Get all restaurant users | ✅ |
| POST | `/user` | Create new user | ✅ |
| GET | `/user/:userId` | Get specific user | ✅ |
| PUT | `/user/:userId` | Update user | ✅ |
| DELETE | `/user/:userId` | Delete user | ✅ |

### 🪑 Table Management (`/api/v1/restaurants/:restaurantId/table`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/table` | Get all restaurant tables | ✅ |
| POST | `/table` | Create new table | ✅ |
| GET | `/table/:tableId` | Get specific table | ✅ |
| PUT | `/table/:tableId` | Update table | ✅ |
| DELETE | `/table/:tableId` | Delete table | ✅ |
| GET | `/table/search` | Search tables by keyword | ✅ |

### 📋 Menu Management (`/api/v1/restaurants/:restaurantId/menu`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/menu` | Get restaurant menus | ✅ |
| POST | `/menu` | Create new menu | ✅ |
| GET | `/menu/:menuId` | Get specific menu | ✅ |
| DELETE | `/menu/:menuId` | Delete menu | ✅ |

### 🍽️ Menu Item Management (`/api/v1/restaurants/:restaurantId/menu/:menuId/menuItem`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/menuItem` | Get all menu items | ✅ |
| POST | `/menuItem` | Create new menu item | ✅ |
| GET | `/menuItem/:menuItemId` | Get specific menu item | ✅ |
| PUT | `/menuItem/:menuItemId` | Update menu item | ✅ |
| DELETE | `/menuItem/:menuItemId` | Delete menu item | ✅ |
| PATCH | `/menuItem/:menuItemId/field` | Update specific field | ✅ |

### 📅 Reservation Management (`/api/v1/restaurants/:restaurantId/reservations`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reservations` | Get all reservations | ✅ |
| POST | `/reservations` | Create new reservation | ✅ |
| GET | `/reservations/search` | Search reservations | ✅ |
| GET | `/reservations/:reservationId` | Get specific reservation | ✅ |
| PUT | `/reservations/:reservationId` | Update reservation | ✅ |
| DELETE | `/reservations/:reservationId` | Delete reservation | ✅ |
| PUT | `/reservations/:reservationId/assign-table` | Assign table to reservation | ✅ |
| PUT | `/reservations/:reservationId/completed` | Mark reservation as completed | ✅ |
| PUT | `/reservations/:reservationId/cancel` | Cancel reservation | ✅ |

### 🛒 Order Management (`/api/v1/restaurants/:restaurantId/reservations/:reservationId/order`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/order` | Create new order | ✅ |
| GET | `/order/:orderId` | Get specific order | ✅ |
| PUT | `/order/:orderId` | Update order | ✅ |
| PUT | `/order/:orderId/complete` | Complete order | ✅ |
| GET | `/order` | Get all orders for reservation | ✅ |

### 💰 Bill Management (`/api/v1/restaurants/:restaurantId/reservations/:reservationId/order/:orderId/bill`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/bill` | Create bill for order | ✅ |
| GET | `/bill/:billId` | Get specific bill | ✅ |
| GET | `/bill/order/:orderId` | Get bill by order ID | ✅ |

### 💳 Payment Management (`/api/v1/restaurants/:restaurantId/reservations/:reservationId/order/:orderId/bill/:billId/payment`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/payment` | Process payment | ✅ |

### 🔧 Admin Endpoints (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/*` | Admin panel routes | ✅ (Admin only) |

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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- RabbitMQ 3.8+
- Docker & Docker Compose (optional)

### 1. Clone Repository
```bash
git clone <repository-url>
cd Restofy
```

### 2. Backend Setup
```bash
cd back-end
npm install
cp env.example .env
# Edit .env with your database and service configurations
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

### 3. Frontend Setup
```bash
cd front-end
npm install
cp .env.example .env
# Edit .env with your API base URL
npm run dev
```

### 4. Notification Service Setup
```bash
cd notification-service
npm install
cp .env.example .env
# Edit .env with your configurations
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

### 5. Docker Setup (Alternative)
```bash
# From project root
docker-compose up --build
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/restofy_db"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"

# RabbitMQ
RABBITMQ_URL="amqp://localhost:5672"

# Server
PORT=3001
NODE_ENV="development"

# Frontend URL
CLIENT_FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env)
```env
VITE_API_BASE_URL="http://localhost:3001"
```

### Notification Service (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/notification_db"

# RabbitMQ
RABBITMQ_URL="amqp://localhost:5672"

# Email
EMAIL_USERNAME="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# JWT
JWT_SECRET="your-secret-key"

# Frontend URL
CLIENT_FRONTEND_URL="http://localhost:5173"
```

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

## 🔐 Authentication & Authorization

### User Roles
- **Owner**: Full access to their restaurants
- **Manager**: Full access within assigned restaurants
- **Staff**: Limited access (read + specific updates)
- **Customer**: Basic access for reservations

### Permission System
The system uses a granular permission-based access control:
- `CAN_CREATE_RESTAURANT`
- `CAN_VIEW_RESTAURANT`
- `CAN_UPDATE_RESTAURANT`
- `CAN_DELETE_RESTAURANT`
- `CAN_CREATE_RESERVATION`
- `CAN_VIEW_RESERVATION`
- `CAN_UPDATE_RESERVATION`
- `CAN_DELETE_RESERVATION`
- `CAN_ASSIGN_RESERVATION_TO_TABLE`
- `CAN_MARK_RESERVATION_COMPLETED`
- `CAN_CANCEL_RESERVATION`
- `CAN_SEARCH_RESERVATION`

---

## 🔄 Event-Driven Architecture

### Message Flow
1. **Backend** publishes events to RabbitMQ
2. **Notification Service** consumes events
3. **Email notifications** sent to users
4. **Invoice PDFs** generated and attached

### Event Types
- Order created
- Payment completed
- Reservation confirmed
- Bill generated

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

## 🚀 Deployment

### Production Build
```bash
# Backend
cd back-end
npm run build
npm start

# Frontend
cd front-end
npm run build
# Serve with Nginx

# Notification Service
cd notification-service
npm start
```

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📝 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Mohit Kumar**
- GitHub: [@mokumar](https://github.com/mokumar)
- Email: itsmohit2022@gmail.com

---

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the `BLOCKERS.md` for known issues
- Review the `LEARNING_GUIDE.md` for development resources

---

## 🔮 Future Enhancements

See `future.md` for planned features:
- Real-time notifications with WebSockets
- Mobile app development
- Advanced analytics dashboard
- Multi-language support
- Integration with payment gateways
- Inventory management
- Staff scheduling system