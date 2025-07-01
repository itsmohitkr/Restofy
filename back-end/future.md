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



## Notes
- This feature is intended for unauthenticated users and should be accessible from the landing page.
- The chatbot should provide a conversational and user-friendly experience.
- Consider extensibility for more advanced queries and future AI enhancements. 