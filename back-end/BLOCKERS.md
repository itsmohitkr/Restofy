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

**Summary:**
Each architectural decision was made to maximize maintainability, security, and scalability, while keeping the codebase easy to understand and extend. When facing a blocker, I researched best practices, evaluated trade-offs, and chose the approach that best fit the project's needs.

*Add more blockers and solutions as the project evolves!* 