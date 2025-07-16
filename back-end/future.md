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