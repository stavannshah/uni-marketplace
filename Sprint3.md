# Sprint3.md
---

**Team Name**: University Student Marketplace Development Team  
**Sprint Duration**: March 04 – March 25, 2025  

**Contributors**:  
- **Frontend Engineers**: Stavan Shah, Priyanshu Mathur  
- **Backend Engineers**: Ahmed Ali Syed, Vedant Upganlawar  

**Frontend video link**: [[Frontend Video](https://drive.google.com/file/d/1HIQ18L5P2qMrvm67LawSVOI-fj5Tqde7/view?usp=sharing)]
**Backend video link**: [[Backend Video](https://drive.google.com/file/d/1ZbGyzHbKQGwsXm7g2FBn6QCg6JRxgzH7/view?usp=sharing)]  
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

5. **Updated Backend API Documentation**  
   - We updated the documentation of the API by adding the Currency Exchange and User Activities API.  
   - **API Endpoint Documentation**: [[API Documentation](https://documenter.getpostman.com/view/42795112/2sAYdiopTw)]
   - **Acceptance Criteria**:  
     - API documentation includes request/response structures.  
     - API endpoints are clearly defined in below "API Endpoints Documentation" section.

6. **Development of `getUserActivities` Function**  
   - Implemented the `getUserActivities` API to retrieve a user's activities from three collections: `marketplace_listings`, `currency_exchange_requests`, and `subleasing_requests`.
   - Ensured that the API accepts a `user_id` query parameter and returns aggregated data on marketplace listings, currency exchange requests, and subleasing requests.
   - Handled errors and returned appropriate responses if any data retrieval failed from the database.

7. **Development of `getCurrencyExchangeRequests` Function**  
   - Implemented the `getCurrencyExchangeRequests` API to fetch all currency exchange requests from the `currency_exchange_requests` collection.
   - Included response data that consists of the total count of requests and the details of each request.
   - Handled potential errors and provided meaningful error messages in case of failure.

8. **Integration of New Routes in Main Router**  
   - Added the newly developed APIs (`/api/user/activities` and `/api/currency/exchange/requests`) to the main router to enable access to user activities and currency exchange request data.
   - Ensured proper routing and error handling in the backend.

9. **Test for `getUserActivities` API**  
   - Implemented a test for the `getUserActivities` API, which verifies the ability to fetch user activities from the database based on the `user_id`.
   - Created a mock database collection for marketplace listings, simulating the insertion of a test user listing.
   - The test ensures that the API correctly returns a 200 HTTP status and retrieves user activities.

10. **Test for `getCurrencyExchangeRequests` API**  
    - Developed a test for the `getCurrencyExchangeRequests` API, verifying that the API correctly retrieves currency exchange requests from the database.
    - Ensured that the API responds with the correct status and data format when valid requests are made.
    - The test also checks for appropriate error handling when issues arise during data retrieval.
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
5. **DisplaysItemListingsCorrectly**  
   - Verifies that the item listing component correctly fetches and displays item data including title, category, description, and price.
6. **OpensListingFormDialog**  
   - Checks that clicking the "Create Listing" button opens the new listing form dialog.
7. **RendersButtonWithCorrectText**  
   - Ensures the button renders and displays the correct child text content.
8. **CallsOnClickHandlerWhenClicked**  
   - Verifies that the `onClick` callback is called when the button is clicked.
9. **AppliesAdditionalClassNameWhenProvided**  
   - Checks that custom class names are applied to the button in addition to default styles.
10. **RendersChildrenCorrectly**  
   - Verifies that the `Card` component correctly renders its child content.


---

## Backend Unit Tests  
1. **TestUserIDRecognition**  
   - Confirms that the system correctly identifies users based on `user_id`.

2. **TestGetUserActivitiesAPI**  
   - Ensures that `GET /api/user/activities` retrieves the correct user activities, including marketplace listings, currency exchange requests, and subleasing requests.

3. **TestMarketplaceListingsQuery**  
   - Verifies that the marketplace listings are correctly queried from the database based on `user_id`.

4. **TestCurrencyExchangeRequestsQuery**  
   - Confirms that currency exchange requests are correctly retrieved from the database based on `user_id`.

5. **TestSubleasingRequestsQuery**  
   - Validates that subleasing requests are correctly queried from the database based on `user_id`.

6. **TestAggregatedUserActivities**  
   - Ensures that the system correctly aggregates marketplace listings, currency exchange requests, and subleasing requests into a single response.

7. **TestUserIDRequiredError**  
   - Confirms that a `400 Bad Request` error is returned when `user_id` is not provided in the API request.

8. **TestMongoDBConnection**  
   - Verifies the successful connection to the test MongoDB instance.

9. **TestSuccessfulAPIResponse**  
   - Ensures that the `GET /api/user/activities` endpoint returns a successful `200 OK` response with correct JSON payload.

10. **TestDatabaseInsertion**  
    - Checks that marketplace listings are correctly inserted into the database.


---

## Next Steps for Sprint 4  
1. Implement user profile preferences for personalized UI.  
2. Develop UI for remaining listing tabs.  
3. Conduct performance optimization and security enhancements.  

