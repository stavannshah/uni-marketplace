# Sprint3.md
---

**Team Name**: University Student Marketplace Development Team  
**Sprint Duration**: March 04 – March 25, 2025  

**Contributors**:  
- **Frontend Engineers**: Stavan Shah, Priyanshu Mathur  
- **Backend Engineers**: Ahmed Ali Syed, Vedant Upganlawar  

**Frontend video link**: [Placeholder for video link]  
**Backend video link**: [Placeholder for video link]  
**GitHub Link**: [https://github.com/stavannshah/uni-marketplace/edit/main/Sprint3.md]  

## Sprint 3 Report  

### Work Completed in Sprint 3  
1. **User ID Functionality Integration**  
   - Implemented a `userid` functionality to recognize users upon login, which allows for a seamless user experience.
   - Every API request is now personalized by requiring only the `userid`, reducing the risk of unauthorized access and improving database query efficiency.
   - Backend authentication logic was updated to ensure that only valid `userid` values are processed for user-specific operations.

2. **Item Listing Tab Implementation**  
   - Developed and connected the backend API to retrieve and display all marketplace item listings.
   - Implemented an optimized UI featuring a sleek card-based interface to enhance readability and accessibility.
   - Added a "Create Listing" button, allowing users to post new listings.
   - Any new listing is stored in the backend database and immediately reflected on the frontend without requiring a page refresh.
   - Two APIs were created to support this functionality:
     - **GET /api/user/listings**: Retrieves all listings associated with the authenticated user.
     - **POST /api/user/listing**: Enables users to create new listings, storing details such as title, description, category, price, condition, location, and images.

3. **Home Page UI Enhancements**  
   - The homepage was redesigned to prominently display "User Listings," i.e., the listings a user has created.
   - Implemented real-time updates so that any new listings appear immediately without needing to refresh the page.
   - Improved UI elements for a cleaner and more intuitive experience.
   
4. **Unit Testing for Frontend and Backend**  
   - Developed and executed unit tests to validate the robustness of both frontend and backend implementations.
   - Ensured that API responses are correctly processed and displayed on the UI.
   - Verified that user interactions (such as creating listings) work without errors and persist data correctly.

---

## Future Work  
1. **User Profile Functionalities**  
   - Introduce user profiles where users can store their preferences.
   - Enable the homepage to display personalized content based on user preferences.
   
2. **UI for Remaining Listing Tabs**  
   - Design and implement UI for the remaining two listing tabs.

---

## Frontend Unit Tests  
1. **TestUserLogin**  
   - Verifies that users can log in and obtain the correct `userid`.
2. **TestItemListingDisplay**  
   - Checks if all user listings are correctly retrieved and displayed.
3. **TestCreateListingButton**  
   - Ensures that clicking the "Create Listing" button triggers the correct API call.
4. **TestHomepageRendering**  
   - Validates that user listings appear dynamically on the homepage.

---

## Backend Unit Tests  
1. **TestUserIDRecognition**  
   - Confirms that the system correctly identifies users based on `userid`.
2. **TestGetUserListingsAPI**  
   - Ensures that `GET /api/user/listings` retrieves the correct listings.
3. **TestPostUserListingAPI**  
   - Validates that `POST /api/user/listing` successfully creates and stores a new listing.
4. **TestDatabaseStorage**  
   - Checks that new listings are correctly saved in the database.

---

## Updated API Documentation  

### User Management  
- **POST /api/saveUser**  
  - Saves a new user to the database with their email, name, and last login timestamp.

- **GET /api/users**  
  - Retrieves a list of all registered users.

### Marketplace Listings  
- **POST /api/user/listing**  
  - Creates a new listing with title, description, category, price, condition, location, and images.

- **GET /api/user/listings**  
  - Fetches all listings created by the user.

- **POST /api/marketplace/listing**  
  - Adds a new general marketplace listing.

- **GET /api/marketplace/listings**  
  - Retrieves all marketplace listings.

### Currency Exchange Requests  
- **POST /api/currency/exchange**  
  - Creates a currency exchange request with user ID, amount, source currency, and target currency.

### Subleasing Requests  
- **POST /api/subleasing**  
  - Posts a subleasing request including rent, location, period, and images.

- **GET /api/subleasing/requests**  
  - Retrieves all subleasing requests.

---

## Next Steps for Sprint 4  
1. Implement user profile preferences for personalized UI.  
2. Develop UI for remaining listing tabs.  
3. Conduct performance optimization and security enhancements.  

