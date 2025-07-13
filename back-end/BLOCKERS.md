# Blockers & Solutions: Concepts and Approaches

This document details the key conceptual and architectural blockers encountered during the development of the Restofy backend, the options considered, the reasoning behind each major decision, and how each was resolved. This serves as a reference for future development and for reviewers to understand the thought process behind the project's structure.

---

## 1. Separation of Concerns: Router, Controller, Service, Repository
**Blocker:**
How should the backend code be organized to maximize maintainability, testability, and scalability?

**Options Considered:**
- Flat structure (all logic in route handlers)
- MVC (Model-View-Controller)
- Router-Controller-Service-Repository pattern

**Reasoning:**
- Flat structure is quick for small projects but quickly becomes unmanageable.
- MVC is common but can blur business logic and data access.
- Router-Controller-Service-Repository provides clear separation of concerns, making the codebase easier to test, maintain, and extend.

**Solution:**
- Adopted the Router-Controller-Service-Repository pattern:
  - **Router:** Handles HTTP endpoints and maps to controllers.
  - **Controller:** Handles request/response logic, calls services.
  - **Service:** Contains business logic, orchestrates data operations.
  - **Repository:** Handles direct database operations (with Prisma).

---

## 2. Validation Strategy
**Blocker:**
How to ensure all incoming data is valid, secure, and easy to maintain?

**Options Considered:**
- Manual validation in controllers
- Using a validation library (Joi, Yup, Zod)

**Reasoning:**
- Manual validation is error-prone and hard to maintain.
- Joi is widely used, expressive, and integrates well with Express middleware.

**Solution:**
- Used Joi for schema-based validation.
- Centralized validation logic in middleware for reusability and consistency.
- Prevents invalid data from reaching business logic or the database.

---

## 3. Error Handling
**Blocker:**
How to provide consistent, informative error responses and avoid code duplication?

**Options Considered:**
- Handle errors in each controller
- Use a centralized error handler middleware

**Reasoning:**
- Handling errors in each controller leads to repetitive code and inconsistent responses.
- Centralized error handler ensures all errors are formatted and logged consistently.

**Solution:**
- Implemented a centralized error handler middleware.
- All errors (including from async functions and middleware) are routed here using `next(error)`.
- Ensures all API responses have a consistent structure and status code.

---

## 4. Testing
**Blocker:**
How to ensure code quality, catch regressions, and support refactoring?

**Options Considered:**
- Manual testing
- Automated testing with Jest, Mocha, Supertest

**Reasoning:**
- Manual testing is slow and unreliable.
- Jest and Supertest are widely used, easy to set up, and support both unit and integration tests.

**Solution:**
- Integrated Jest and Supertest for unit and integration testing.
- Wrote tests for all major endpoints, including edge cases and validation errors.
- This provides confidence in code changes and helps prevent bugs.

---

## 5. Role-Based Access Control (RBAC)
**Blocker:**
How to manage permissions for owners, staff, managers, and customers?

**Options Considered:**
- Separate tables for each user type
- Single user table with a role column (enum or string)
- Many-to-many roles table for multi-role users

**Reasoning:**
- Separate tables lead to code duplication and complex queries.
- Single user table with a role column is simple, scalable, and easy to enforce in middleware.
- Many-to-many roles table is flexible but adds complexity; not needed for current requirements.

**Solution:**
- Decided to use a single `User` table with a `role` field (enum) and appropriate relations for owners, staff, and customers.
- This allows flexible, scalable role management and easy enforcement of permissions in middleware.

---

## 6. JWT Payload Design
**Blocker:**
What information should be included in authentication tokens for security and scalability?

**Options Considered:**
- Include all user info (name, email, role, etc.)
- Include only essential info (user ID, role)

**Reasoning:**
- JWTs are visible to the client; including sensitive or unnecessary data is a security risk.
- Only essential info is needed for authentication and authorization.

**Solution:**
- Only included essential information (user ID, role) in JWT payloads.
- Avoided sensitive or unnecessary data for security and privacy.
- Set token expiration for added security.

---

## 7. Component Reusability (Frontend)
**Blocker:**
How to avoid code duplication in UI forms and ensure a consistent user experience?

**Options Considered:**
- Separate form components for each feature
- Single reusable form component with props

**Reasoning:**
- Separate components lead to code duplication and inconsistent UI.
- Reusable components reduce code, are easier to maintain, and ensure consistency.

**Solution:**
- Created reusable form components (e.g., `CardForm`) for add/edit features.
- Used props to customize behavior for different use cases.
- This reduces code duplication and ensures a consistent user experience.

---

## 8. Unified User Table
**Blocker:**
How to support multiple user types (owner, staff, customer) without duplicating data?

**Options Considered:**
- Separate tables for each user type
- Single user table with a role field and relations

**Reasoning:**
- Separate tables make authentication, authorization, and user management complex.
- Single user table simplifies logic and supports role-based access control.

**Solution:**
- Refactored schema to use a single `User` table with a `role` field and relations for ownership, staff assignments, and reservations.
- This simplifies authentication, authorization, and user management.

---

## Blocker: Foreign Key Constraint Violation When Deleting a Restaurant

### Problem
When attempting to delete a restaurant that has related records (such as tables, menus, or reservations), a foreign key constraint violation occurs. This is because the database enforces referential integrity, preventing deletion of a parent record that is still referenced by child records.

**Example Error:**
```
Invalid `prisma.restaurant.delete()` invocation
Foreign key constraint violated on the constraint: `Table_restaurantId_fkey`
```

### Cause
- The `Restaurant` table is referenced by other tables (e.g., `Table`, `Menu`, `Reservation`) via foreign keys.
- If related records exist, the database will block deletion of the restaurant to maintain data integrity.

### Solutions
1. **Manually Delete Related Records First**
   - Before deleting a restaurant, delete all related records in other tables that reference this restaurant.
   - Example (pseudo-code):
     ```js
     await prisma.table.deleteMany({ where: { restaurantId } });
     await prisma.menu.deleteMany({ where: { restaurantId } });
     await prisma.reservation.deleteMany({ where: { restaurantId } });
     await prisma.restaurant.delete({ where: { id: restaurantId } });
     ```

2. **Use `ON DELETE CASCADE` in Prisma Schema**
   - Update your `schema.prisma` to use `onDelete: Cascade` for all relations referencing `Restaurant`.
   - Example:
     ```prisma
     model Table {
       id            Int        @id @default(autoincrement())
       restaurantId  Int
       restaurant    Restaurant @relation(fields: [restaurantId], references: [id], onDelete: Cascade)
       // ...
     }
     ```
   - After updating the schema, run `npx prisma migrate dev` to apply the changes.

3. **Prevent Deletion and Return a Friendly Error**
   - Before deleting, check for related records. If any exist, return a user-friendly error message and do not proceed with deletion.

### Recommendation
Choose the approach that best fits your application's data integrity and user experience requirements. For most production apps, using `ON DELETE CASCADE` is common if you want to allow deleting a restaurant and all its related data automatically.

---

## Blocker: Stale Authentication Cookies/Tokens After Database Reset

### Problem
After resetting or deleting the database, authentication cookies or tokens stored in the client (e.g., Postman, browser) may still be sent with requests. These tokens may contain user IDs (e.g., ownerId) that no longer exist in the database. As a result, the backend may treat the request as authenticated, but queries using the deleted user ID will return empty results or allow unintended access.

### Why This Happens
- Authentication tokens (JWTs, cookies) are stateless and remain valid on the client even if the corresponding user is deleted from the database.
- The backend middleware only decodes the token and does not check if the user still exists in the database.

### Example Scenario
1. User logs in and receives a token with their ownerId.
2. The database is reset or the user is deleted.
3. The client continues to send the old token with requests.
4. The backend decodes the token, sees the ownerId, and allows the request to proceed, but queries return empty results since the user no longer exists.

### Solution: Always Check User Existence After Decoding Token
After decoding the token, fetch the user from the database using the ID from the token. If the user does not exist, clear the cookie (if applicable) and return a 401 Unauthorized error.

**Example Middleware (Express + Prisma):**
```js
const restrictToAuthenticatedUser = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return next({
            status: 401,
            message: "You must be logged in to access this resource",
            error: "Unauthorized"
        });
    }
    try {
        const userPayload = getUserFromToken(token);
        if (!userPayload) {
            return next({
                status: 401,
                message: "Invalid token",
                error: "Unauthorized"
            });
        }
        // Check if user exists in DB
        const user = await prisma.user.findUnique({
            where: { id: userPayload.ownerId }
        });
        if (!user) {
            res.clearCookie("token"); // Optional: clear the cookie
            return next({
                status: 401,
                message: "User no longer exists. Please log in again.",
                error: "Unauthorized"
            });
        }
        req.user = user;
        next();
    } catch (error) {
        return next({
            status: 401,
            message: "Invalid token",
            error: error.message || "Unauthorized"
        });
    }
};
```

### Recommendation
**Always check that the user exists in the database after decoding the authentication token.** This ensures that deleted or stale users cannot access protected resources, especially after a database reset or migration.

---

## Cache Invalidation Blocker: Redis and Database Consistency

When using Redis (or any cache) to store data like bills, you must ensure the cache stays consistent with the database. If the underlying data changes (e.g., a bill is marked as paid), the cache can become stale and serve outdated information. This is a classic cache invalidation problem.

### Why Does This Happen?
- Caches (like Redis) store a copy of the data for a set time (TTL), but do not know when the database changes.
- If you update the database (e.g., change bill status to "Paid") but do not update or delete the cache, users may see old data until the cache expires.

### How to Handle Cache Invalidation
- **Delete the cache key** immediately after updating the database (recommended for most web apps):
  ```js
  await redisClient.del(`bill:${billId}`);
  ```
- **Or, update the cache** with the new value after a DB update:
  ```js
  await redisClient.setEx(`bill:${billId}`, 3600, JSON.stringify(updatedBill));
  ```
- This ensures the next read will fetch fresh data from the DB and re-cache it.

### Sample Flow
1. **GET /bill/123** (first time): Not in cache → fetch from DB → cache for 1 hour.
2. **PUT /bill/123 (mark as paid):** Update DB → delete or update `bill:123` in Redis.
3. **GET /bill/123** (within 1 hour): Not in cache (was deleted) → fetch fresh from DB → cache again.

### Key Points
- Always invalidate or update the cache when the underlying data changes.
- Relying only on TTL can lead to stale data and inconsistencies.
- This pattern is called **cache-aside** or **lazy caching**.

**Summary:**
Cache invalidation is critical for data consistency. Always clear or update your cache after any write operation to the database that affects cached data.

---

**Summary:**
Each architectural decision was made to maximize maintainability, security, and scalability, while keeping the codebase easy to understand and extend. When facing a blocker, I researched best practices, evaluated trade-offs, and chose the approach that best fit the project's needs.

*Add more blockers and solutions as the project evolves!* 