# Sprint2.md
---

**Team Name**: University Student Marketplace Development Team  
**Sprint Duration**: Feb 10 – March 03, 2025  

**Contributors**:  
- **Frontend Engineers**: Stavan Shah, Priyanshu Mathur  
- **Backend Engineers**: Ahmed Ali Syed, Vedant Upganlawar  

**Frontend video link**: [Placeholder for video link]  
**Backend video link**: [Placeholder for video link]  
**Github Link**: [https://github.com/stavannshah/uni-marketplace/edit/main/Sprint2.md]  

## Sprint 2 Report  

### User Stories  
1. **Complete Unfinished Sprint 1 Tasks**  
   - **Story**: As a development team, we need to complete pending Sprint 1 tasks to ensure feature completeness.  
   - **Acceptance Criteria**:    
     - Cross-platform compatibility issues are resolved.  

2. **Integrate Frontend and Backend**  
   - **Story**: As a full-stack team, we want a seamless integration between frontend and backend so that data flows correctly between the two.  
   - **Acceptance Criteria**:  
     - APIs are successfully called from the frontend.  
     - User data persists correctly in the database.  

3. **Write Cypress Tests for Frontend**  
   - **Story**: As frontend developers, We wrote Cypress tests to validate UI interactions so that user flows are tested automatically.  
   - **Acceptance Criteria**:  
     - A simple Cypress test is implemented (e.g., clicking a button or filling out a form).  
     - Cypress test suite runs successfully without errors.  

4. **Write Unit Tests for Frontend Framework**  
   - **Story**: As frontend developers, We wrote unit tests to validate frontend logic so that core functionality is reliable.  
   - **Acceptance Criteria**:  
     - Unit tests cover at least one function per frontend feature.  
     - Test results are documented and reviewed.  

5. **Document Backend API**  
   - **Story**: As backend developers, we deveoped a detailed documentation of the API so that future development and integration are easier.  
   - **API Endpoint Documentation**: [[API Documentation](https://documenter.getpostman.com/view/42795112/2sAYdiopTw)]
   - **Acceptance Criteria**:  
     - API documentation includes request/response structures.  
     - API endpoints are clearly defined in below "API Endpoints Documentation" section.


6. **Write Unit Tests for Backend**  
   - **Story**: As a backend developer, I want unit tests to validate backend logic so that API reliability is ensured.  
   - **Acceptance Criteria**:  
     - Each major backend function has a corresponding unit test.  
     - Tests execute successfully with expected outputs.  


## API Endpoints Documentation

### User Management
- **POST /api/saveUser**  
  Saves a new user to the database with their email, name, and last login timestamp.

- **GET /api/users**  
  Retrieves a list of all registered users along with their details.

### Marketplace Listings
- **POST /api/marketplace/listing**  
  Adds a new marketplace listing with title, description, category, price, condition, location, and images.

- **GET /api/marketplace/listings**  
  Fetches all marketplace listings from the database.

### Currency Exchange Requests
- **POST /api/currency/exchange**  
  Creates a currency exchange request with user ID, amount, source currency, and target currency.

### Subleasing Requests
- **POST /api/subleasing**  
  Posts a subleasing request including rent, location, period, and images.

- **GET /api/subleasing/requests**  
  Retrieves all subleasing requests from the database.


# Test Cases for Backend
# Test Cases for Backend

## 1. `TestSaveUser`
### Description:
Tests the `saveUser` API endpoint to ensure that a user can be successfully created and stored in the MongoDB database.

## 2. `TestGetUsers`
### Description:
Tests the `getUsers` API endpoint to ensure retrieval of all users from the database.

## 3. `TestPostMarketplaceListing`
### Description:
Tests the `postMarketplaceListing` API endpoint to ensure a new listing can be successfully created.

## 4. `TestGetMarketplaceListings`
### Description:
Tests the `getMarketplaceListings` API endpoint to ensure all marketplace listings can be retrieved.

## 5. `TestCreateCurrencyExchangeRequest`
### Description:
Tests the `createCurrencyExchangeRequest` API endpoint to ensure a currency exchange request can be successfully created.

## How to Run the Test Cases
To run all test cases, navigate to the project directory and execute the following command:

```sh
go test -v
```

## Planned Issues for Sprint 2  
### Frontend Tasks  
1. Perform cross-platform testing and ensure UI consistency.  
2. Write and execute Cypress tests.  
3. Write unit tests for frontend components.  

### Backend Tasks  
1. Finalize and document API endpoints.  
2. Write unit tests for backend services.  
3. Optimize database connection handling.  
4. Integrate frontend with backend.  

### Integration Tasks  
1. Ensure smooth API calls from frontend.  
2. Verify user authentication and data persistence.  
3. Conduct end-to-end testing with both frontend and backend.  

---  

## Issues Faced  
1. **Frontend-Backend Integration Challenges**  
   - Some API requests failed due to incorrect CORS configuration.  
2. **Testing Environment Issues**  
   - Cypress setup required additional dependencies and configurations.  
3. **Database Connection Optimization**  
   - Needed to implement efficient connection pooling to reduce query delays.  

---  

## Completed Issues  
- Successful integration of frontend and backend.  
- Cypress tests implemented and executed.  
- Backend API documentation finalized.  
- Unit tests written and executed for both frontend and backend.  

---  

## Issues Not Completed and Reasons  
1. **Comprehensive UI Testing**  
   - Some UI tests were incomplete due to limited time for edge cases.  
2. **End-to-End Testing**  
   - Full end-to-end testing remains pending due to backend optimization delays.  

---  

## Next Steps for Sprint 3  
1. Complete any pending Cypress tests for frontend.  
2. Conduct full end-to-end testing across all features.  
3. Optimize API response times for faster frontend performance.  

---
