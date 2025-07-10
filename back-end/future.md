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