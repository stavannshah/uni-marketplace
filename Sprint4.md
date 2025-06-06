# Sprint4.md
---

**Team Name**: University Student Marketplace Development Team  
**Sprint Duration**: March 26 – April 21, 2025  

**Contributors**:  
- **Frontend Engineers**: Stavan Shah, Priyanshu Mathur  
- **Backend Engineers**: Ahmed Ali Syed, Vedant Upganlawar  

**Overall Pitch video link**: [Overall Pitch Demo](https://drive.google.com/file/d/1Y5RQyhS4DARCicUXAAUgU86eH61aPbKo/view?usp=sharing)  
**GitHub Link**: [https://github.com/stavannshah/uni-marketplace](https://github.com/stavannshah/uni-marketplace)

---

## Sprint 4 Report

### Work Completed in Sprint 4  

1. **User Profile Page Implementation**  
   - Implemented `GET /api/getUserProfile/{id}` to retrieve profile information (name, email, preferences, etc.).  
   - Implemented `POST /api/updateUserProfile/{id}` to allow updates to name, preferred email, preferences, and location.  
   - Connected these APIs to the new frontend profile page for real-time updates.

2. **Delete Listing Feature**  
   - Added `DELETE /api/deleteListing/{id}` endpoint to remove listings from `marketplace_listings`, `currency_exchange_requests`, or `subleasing_requests`.  
   - Ensured clean error handling and consistent response formats for deleted and non-existent entries.

3. **Additional Backend Endpoints**  
   - Developed `GET /api/getCurrencyExchangeListings` to return all exchange listings.  
   - Developed `GET /api/getSubleasingRequests` to return all subleasing listings.  
   - Integrated these endpoints into frontend listing tabs.

4. **Frontend Enhancements**  
   - Designed and integrated a responsive user profile page.  
   - Added real-time data update features and confirmation prompts.  
   - Updated listing tabs to show newly supported listing types.

5. **Router and CORS Configuration**  
   - Updated `main.go` to route new endpoints.  
   - Updated CORS settings to support multiple local environments.

6. **Backend Refactoring & Validation**  
   - Improved validation of `ObjectID` parameters in profile and delete APIs.  
   - Used timeouts in MongoDB context for better performance and control.  
   - Standardized error responses for consistency across endpoints.

---

## Frontend Unit Tests  

We test the following components:

| Component | Test File | Description |
|-----------|-----------|-------------|
| App | `App.test.jsx` | Tests login state management and basic app flow |
| ItemListing | `ItemListing.test.jsx` | Tests marketplace listing display and creation |
| CurrencyExchange | `CurrencyExchange.test.jsx` | Tests currency exchange listing display and creation |
| SubLeasing | `SubLeasing.test.jsx` | Tests subleasing listing display and creation |
| UserActivities | `HomePage.test.jsx` | Tests user activities section on homepage |
| UserProfile | `UserProfile.test.jsx` | Tests user profile editing functionality |
| Button | `components/ui/Button.test.jsx` | Tests reusable button component |
| Card | `components/ui/Card.test.jsx` | Tests reusable card component |

---

## Backend Unit Tests  

1. **TestGetUserProfile** – verifies profile is fetched by valid ID.  
2. **TestUpdateUserProfile** – checks MongoDB updates for editable fields.  
3. **TestDeleteListing** – tests success, failure (not found), and invalid ID cases.  
4. **TestGetCurrencyExchangeListings** – confirms listings retrieval with correct format.  
5. **TestGetSubleasingRequests** – validates all subleases are returned with 200 response.  
6. **TestInvalidObjectIDHandling** – tests graceful error for invalid hex IDs.  
7. **TestProfileAPIsEdgeCases** – simulates missing fields or partial updates.  

---

## Updated Documentation for Backend API  

API Documentation: [https://documenter.getpostman.com/view/42795112/2sAYdiopTw](https://documenter.getpostman.com/view/42795112/2sAYdiopTw)  

### Newly Added Routes  
- `GET /api/getUserProfile/{id}`  
- `POST /api/updateUserProfile/{id}`  
- `DELETE /api/deleteListing/{id}`  
- `GET /api/getCurrencyExchangeListings`  
- `GET /api/getSubleasingRequests`

Includes:  
- Sample requests/responses  
- Status code definitions  
- Parameter validation rules  


