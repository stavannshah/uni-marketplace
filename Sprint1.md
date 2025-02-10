# Sprint1.md
---  

**Team Name**: University Student Marketplace Development Team  
**Sprint Duration**: January 20 – February 10, 2025  

**Contributors**:  
- **Frontend Engineers**: Stavan Shah, Priyanshu Mathur  
- **Backend Engineers**: Ahmed Ali, Vedant Upganlawar  

** Frontend video link**: [https://drive.google.com/file/d/1RgWWbgP3YpoQPIpsYgAViRWgjaR6nhGo/view?usp=sharing]  
** Backend video link**: []  


## Sprint 1 Report  

### User Stories
1. **Build OTP Verification UI**  
   - **Story**: As a student, I want a simple and intuitive OTP verification interface so that I can easily verify my university email.  
   - **Acceptance Criteria**:  
     - The UI is responsive and works on different devices.  
     - Users can enter and submit the OTP.  

2. **Integrate API for Email-Based Communication**  
   - **Story**: As a developer, I want to integrate an email-based communication API so that the system can send OTPs to users’ university email addresses.  
   - **Acceptance Criteria**:  
     - The email service is connected and tested.  
     - Users receive OTP emails within a few seconds.  

3. **Fetch and Display Basic Data from Backend**  
   - **Story**: As a frontend developer, I want to fetch basic user data from the backend and display it on the homepage so that the user can see personalized content.  
   - **Acceptance Criteria**:  
     - Basic user information is fetched via API and displayed on the UI.  
     - Error messages appear if data retrieval fails.  

4. **Send User Data to Backend**  
   - **Story**: As a frontend developer, I want to send user data to the backend so that it can be stored and used for authentication and profile management.  
   - **Acceptance Criteria**:  
     - Data is sent to the backend API via HTTP POST request.  
     - Successful requests return confirmation messages.  

5. **Design and Implement Homepage UI**  
   - **Story**: As a student, I want a clean and organized homepage where I can view listings and navigate the platform easily.  
   - **Acceptance Criteria**:  
     - The homepage displays item listings and categories.  
     - Navigation options are intuitive and easy to use.  

6. **Set up Golang Project and Database Schema**  
   - **Story**: As a backend developer, I want to set up the Golang project and design the database schema so that the project structure is organized and ready for development.  
   - **Acceptance Criteria**:  
     - Golang project is initialized with a modular structure.  
     - MongoDB schema for users is defined and documented.

7. **Create API Endpoints for User Authentication**  
   - **Story**: As a backend developer, I want to create API endpoints for user authentication so that users can securely sign up and log in.  
   - **Acceptance Criteria**:  
     - POST `/api/register`: Creates a new user entry after OTP verification.  
     - POST `/api/login`: Authenticates users and returns a session token.  

8. **Connect Backend to MongoDB**  
   - **Story**: As a backend developer, I want to connect the backend to MongoDB so that user data can be stored and retrieved efficiently.  
   - **Acceptance Criteria**:  
     - Backend successfully connects to MongoDB.  
     - Environment variables manage MongoDB connection strings.  

9. **Fetch User Data from Frontend and Store in MongoDB**  
   - **Story**: As a backend developer, I want to fetch user data from the frontend and store it in MongoDB so that it can be used for authentication and personalization.  
   - **Acceptance Criteria**:  
     - User data received from the frontend is validated and stored in MongoDB.  
     - Error handling and response status codes are implemented.  


## Planned Issues for Sprint 1  
### Setup and Installation  
1. Install NodeJs, ReactJs, Golang, MongoDB.  
2. Set up Git branches for frontend and backend development.  
3. Initialize application and connect frontend to backend.  
4. Design the data structure for User and User Profiles.  

### Frontend Tasks  
1. Build OTP verification UI.  
2. Integrate EmailJS API for email-based communication.  
3. Build Homepage UI.  
4. Send user data to the backend.  

### Backend Tasks  
1. Set up the Golang project and database schema.  
2. Create API endpoints for user authentication.  
3. Connect backend to MongoDB.  
4. Integrate backend with frontend.  
5. Fetch user data from frontend and store it in MongoDB.  
6. Fetch data from MongoDB and populate Homepage UI.  

### Integration Tasks  
1. Perform the first integration between backend and frontend.  
2. Ensure cross-platform compatibility across Windows and macOS.  

---  

## Issues Faced  
1. **Integration Challenges**  
   - First integration between backend and frontend was time-consuming.  
2. **Cross-Platform Compatibility**  
   - JSON-lock file upload restrictions caused version mismatches.  
3. **Frontend Setup Error**  
   - Issue with creating a React app, resolved by switching to Vite.  
4. **Backend-Port Connection Issue**  
   - Backend wasn’t connecting to frontend due to port conflicts.  
5. **Database Versioning Issues**  
   - Each team member had a local MongoDB instance with different versions, leading to inconsistency.  

---  

## Completed Issues  
- OTP verification system with EmailJS API.  
- Initial setup and installation of NodeJs, ReactJs, Golang, and MongoDB.  
- Backend setup and successful connection to MongoDB.  
- Integration of backend and frontend for authentication flow.  

---  

## Issues Not Completed and Reasons  
1. **Homepage with Item Listings and Notifications**  
   - Not completed due to time constraints and unresolved integration challenges.  
2. **Cross-Platform Testing**  
   - Full testing across different operating systems remains pending.  

---  

## Next Steps for Sprint 2  
1. Complete the Homepage UI with item listing and notification functionality.  
2. Perform full cross-platform testing and resolve compatibility issues.  
3. Optimize database connection and versioning for a seamless development process.  

---  

