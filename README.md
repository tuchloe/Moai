# Project Title: Moai

# 🏛️ Moai - Social Connection Platform

Moai is a social platform designed for seniors. This project focuses on authentication, IP-API, database structure/functionality, Meet Someone feature, and tailored UX/UI and screen reader support for accessibility. 

---

## Dev Set-up **  

Follow these instructions to install and run the project in your local development environment.

---

## **1. Prerequisites**  

Ensure you have installed:  

- **[Node.js] 
- **[MySQL]
- **[Git]
- 
---

## **2. Clone the Repository**  
Open a terminal and run:  
```sh
git clone https://github.com/your-username/moai.git
cd moai

##  **3. Install Dependencies**
Run the following command to install all required packages:

sh
Copy
Edit
npm install
This will install all dependencies from package.json for both the backend and frontend.

##  **4. Setup Environment Variables**
Create a .env file in the root directory by copying the provided example file:
cp .env.example .env
Then, open the .env file and fill in your own values (see the section Environment Variables).

##  ** 5. Set Up the Database **
Start MySQL and create a new database
Import the schema: moai_db

Update your .env file with your MySQL credentials.

##  ** 6. Start the Backend Server **
Start the Express.js API server:

This will:
- Start the backend server on http://localhost:5000
- Connect to the MySQL database
- Verify API endpoints

##  ** 7. Start the Frontend **
In another terminal window, run:
npm start

This will start the React frontend and automatically open http://localhost:3000 in your browser.

##  ** 8. Open the Project in Your Browser **
Once both backend and frontend are running, open http://localhost:3000 in your browser

You should see the Moai login page or dashboard.






## Overview

"Moai" is a concept originating from Okinawa, Japan that refers to a social group of lifelong friends that can provide support in social, financial, health, or spiritual interests. This concept is strongly associated with increasing longevity through social fulfillment, especially in old age.

Moai is a social platform for seniors to make new friends online and arrange/attend social gatherings.

### Problem

The issue this application addresses is the difficulty sociailizing and meeting new people in older age, especially in an extremely multicultural city like Toronto, where most seniors are immigrants and therefore have language barriers and differences in culture, values, and social norms. Not only can it be an extremely isolating lifestyle, but social fulfilment impacts longevity as well.

### User Profile

This app is intended for seniors (approx age 60+), an age group that is known for not being technologically savvy, so in addition to a focus on web-accessibility, I will focus on making the app simple and user-friendly by minimizing the features of the app to only the essentials required to achieve the goal of the app. 

Vision Impairments:
- large text and high contrast
- simplified navigation icons
- screen reader support

Hearing Impairments:
- visual cues as well as auditory ones 

Usability for Non-Tech-Savvy Users:
- intuitive onboarding (simple sign up and optional tutorials that can be rewatched later) 

### Features

- Landing/Log in page: explains the concept of Moai and allows you to log in or create an account 
- User profiles: 
-- Name 
-- Age 
-- Location 
-- Languages 
-- Interests 
-- 1 display picture, up to 10 more
-- Religion (if applicable)
-- Ideal meeting type (dropdown)
- Search feature 
- Inbox feature 
- Notifications
- Meet someone new! Randomized profile, can filter by age, location, language, ideal meeting (dating app style)
- Location tracking, to ensure they are being matched with locals

## Implementation

### Tech Stack

List technologies that will be used in your app, including any libraries to save time or provide more functionality. Be sure to research any potential limitations.
1. Landing/Login Page
- React.js: Utilize React to build dynamic and responsive user interfaces. 
- React Router: Manage navigation between pages seamlessly.
- Formik: Simplify form handling for login and registration.
- Yup: Implement schema validation for form inputs.

2. User Profiles
- React.js: Create interactive profile components.
- Styled Components: Apply scoped and maintainable CSS to enhance readability.
- Cloudinary: Handle image uploads and storage efficiently.

3. Inbox Feature
- Socket.io: Enable real-time messaging capabilities.
- Redux: Manage application state for consistent message handling.
- Express.js: Set up the backend server to handle API requests.

4. "Meet Someone New!" Feature
- Express.js: Develop APIs to fetch and filter user profiles.
- MySQL: Store user data and preferences securely.
- Axios: Handle HTTP requests to the backend.

5. Location Tracking
- Geolocation API: Access user's location with permission.
- GeoIP-lite: Fallback to IP-based location detection if necessary.

### APIs

IP-API: Match users by geographic proximity and suggest local meet-up spots using approximate location detection based on IP addresses.
ResponsiveVoice Text-to-Speech: Convert text (like messages) to speech for visually impaired users.
OneSignal: Send push notifications for friend requests or new messages.

### Sitemap

List the pages of your app with brief descriptions. You can show this visually, or write it out.

1. Landing Page/Log In Page
Brief explanation of the app's purpose and benefits.
Log in and Sign up buttons.

2. Sign-Up Page
Input fields: Name, Age, Email, Location, Language(s), Interests, etc.
Optional profile photo upload.
Accessibility-friendly UI with large fonts and tooltips.

3. User Dashboard/Home Page
Serves as the main hub where users can navigate to other features and see their notifications.

4. Profile Page
Display the user's own information or another user’s profile.
Will include personal details like name, age, interests, and a short bio.
Option to edit profile (for the user’s own profile).
Add as Friend button for other user profiles.

5. Meet Someone New! Page
Randomized "friend finder" feature to discover local matches, similar to dating apps. Will include filter options: age, location, language, and ideal meeting type (e.g., coffee, walk).
Swipe or next/previous buttons.
View profiles and send friend requests.

6. Inbox/Messages Page
Facilitate private conversations between users.
Real-time messaging interface with basic features (text, emojis, maybe images).

7. "My Friends" Page
List of friends, requests, and pending outgoing requests. The friends list will also have the option to message.

8. Settings Page
Allows users to manage app preferences and account settings.
Notification preferences (e.g., email or push).
Privacy settings (e.g., hide location).
Language and accessibility adjustments.

8. About/Help Page
Provide information about the app and support for users.
FAQ section for common questions.
Contact support form or email link.
Instructions (with videos) on how to use each feature.


### Mockups

Provide visuals of your app's screens. You can use tools like Figma or pictures of hand-drawn sketches.
![467800701_1092451722370991_5789935319439656191_n](https://github.com/user-attachments/assets/5ea2af52-d0d5-4b0e-aede-293759a85870)
![466288755_901901565266857_2915793108590328489_n](https://github.com/user-attachments/assets/9faf69ed-9e9b-45bc-9708-e43e76644b4a)
![465873053_1917715578755724_6463455380041972291_n](https://github.com/user-attachments/assets/28e44b27-b2e6-449e-a5d5-80f7a2a7b931)
![467777794_1139696414392638_4644772189698274264_n](https://github.com/user-attachments/assets/c22be941-f542-4dc6-a218-beaff209b048)
![465211061_3854330678141868_4397729636206170235_n](https://github.com/user-attachments/assets/05289cc9-9359-4af8-84a2-26fa249d5660)
![465606987_1127058338906241_7967332543155466375_n](https://github.com/user-attachments/assets/b43e8066-1f65-49b8-9f81-97cb119e4d4c)
![466418675_1725528138302766_9097447306027146922_n](https://github.com/user-attachments/assets/7600e8c9-8cb6-4e9f-b973-88493f43f453)


### Data

1. Users
Description: Represents individual users who log in to the app.
Relationships:
One-to-One with Profiles: A user can have one profile.
One-to-Many with Messages: A user can send and receive many messages.
Many-to-Many with Friends: A user can befriend many users.

2. Profiles
Description: Stores additional user information for social and matchmaking purposes.
Relationships:
One-to-One with Users: A profile belongs to a single user.
One-to-Many with Friends: A profile can be matched with multiple profiles.

3. Messages
Description: Stores chat data between users.
Relationships:
Many-to-One with Users: Each message is tied to a sender and a receiver.

4. Friends
Description: Tracks matched users for social connection.
Relationships:
Many-to-Many with Users: Friend connections involve two users.
One-to-Many with Profiles: A friend can involve multiple profiles.

5. Settings
Description: Stores user-specific app settings.
Relationships:
One-to-One with Users: Each user has one settings record.

Entity-Relationship Diagram Summary
Users are the central entity.
Profiles are directly linked to Users (1-to-1).
Messages are linked to Users (1-to-many for sender/receiver).
Matches create a many-to-many relationship between Users.
Games optionally link two Users for shared activities.
Settings are tied 1-to-1 with Users for custom preferences.

### Endpoints

1. Register a User
Method: POST
Endpoint: /api/auth/register
Parameters (JSON body):
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "Chloe Tu",
  "age": 26,
  "location": "Toronto"
  "languages": English, Cantonese
}

Response:
Success:
{
  "message": "Welcome to the Moai community!",
  "user_id": 1
}
Error:
{
  "error": "Email already in use"
}

2. Log In
Method: POST
Endpoint: /api/auth/login
Parameters (JSON body):
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
Success:
{
  "message": "Welcome back",
  "token": "jwt_token_here"
}
Error:
{
  "error": "Invalid login information"
}

3. Get User Profile
Method: GET
Endpoint: /api/users/:user_id
Parameters:
user_id (Path Parameter)
Response:
{
  "user_id": 1,
  "name": "John Doe",
  "age": 65,
  "location": "Toronto",
  "languages": ["English"],
  "interests": ["Gardening", "Reading"],
  "bio": "I love making new friends!"
}

4. Update User Profile
Method: PUT
Endpoint: /api/users/:user_id
Parameters (JSON body):
{
  "location": "Toronto",
  "languages": ["English", "French"],
  "interests": ["Gardening", "Reading"],
  "bio": "Updated bio"
}
Response:
{
  "message": "Profile updated successfully"
}

5. Get Random Match
Method: GET
Endpoint: /api/matches/random
Parameters (Query Parameters):
age_range: 50-70
location: Toronto
Response:
{
  "match_id": 12,
  "name": "Jane Smith",
  "age": 68,
  "location": "Toronto",
  "languages": ["English"],
  "interests": ["Cooking", "Hiking"]
}

6. Create Friend Request
Method: POST
Endpoint: /api/matches/request
Parameters (JSON body):
{
  "user_id": 1,
  "friend_user_id": 2
}
Response:
json
Copy code
{
  "message": "Friend request sent"
}

7. Get Messages
Method: GET
Endpoint: /api/messages/:conversation_id
Parameters:
conversation_id (Path Parameter)
Response:
{
  "conversation_id": 101,
  "messages": [
    {
      "sender_id": 1,
      "content": "Hi there!",
      "timestamp": "2024-12-21T10:00:00Z"
    },
    {
      "sender_id": 2,
      "content": "Hello! How are you?",
      "timestamp": "2024-12-21T10:02:00Z"
    }
  ]
}

8. Send a Message
Method: POST
Endpoint: /api/messages/send
Parameters (JSON body):
{
  "conversation_id": 101,
  "sender_id": 1,
  "content": "Looking forward to our chat!"
}

### Auth

Does your project include any login or user profile functionality? If so, describe how authentication/authorization will be implemented.

1. Authentication (Login Functionality)

- Back-End Implementation
Technologies: Node.js, Express.js, MySQL, and bcrypt for password hashing.

User Registration:
Hash the password using bcrypt before storing it in the database.
Save user details (email, hashed password, etc.) in the MySQL database.

Login:
Verify the email and password against the stored values.
If correct, generate a JWT containing the user ID and other claims.

- Front-End Implementation
Technologies: React.js with Axios for API calls and localStorage for token management.

Login Form:
Create a form to collect email and password.
Send the credentials to the /api/auth/login endpoint using Axios

Persisting Login:
Use React Context or a global state (like Redux) to manage the login state.
Check for the JWT token in localStorage to persist the session across page reloads.

2. Authorization (Restrict Access)

- Back-End Implementation
Verify JWT Middleware:
Create a middleware function to verify the token and extract the user ID from it.
Use this middleware for routes requiring authentication

3. Secure the Application

Password Security:
Use bcrypt to hash passwords and never store them in plaintext.

Environment Variables:
Store secrets (e.g., JWT_SECRET, DB credentials) in an .env file and access them using process.env.

Token Expiry:
Set a reasonable expiration for JWT tokens (e.g., 1 hour) and refresh as needed.

HTTPS:
Ensure all communication happens over HTTPS to protect sensitive data.

## Roadmap

Scope your project as a sprint. Break down the tasks that will need to be completed and map out timeframes for implementation. Think about what you can reasonably complete before the due date. The more detail you provide, the easier it will be to build.

- Sprint 1: December 28 – January 6
Set up the foundation for the project, including environment, database, and basic UI.

Tasks:

- Project Setup:
Initialize the repository with Git/GitHub.
Set up the project structure for full-stack development (React for front-end, Express/Node for back-end).
Install dependencies (e.g., Axios, bcrypt, JWT, React Router).

- Database Design and Setup:
Create the MySQL database schema based on the ER diagram.
Set up tables for users, profiles, and messages.
Seed the database with sample users and dummy data for testing.

- Landing/Login Page:
Design and develop the landing page (HTML, CSS, React components).
Implement the login and registration forms.

- Authentication System:
Back-end: Implement user registration, login, and JWT-based authentication.
Front-end: Connect the login form to the authentication API.


- Sprint 2: January 7 – January 15
Build core features (profiles, matchmaking, and messaging).

Tasks:
- User Profiles:
Back-end: Create APIs to fetch, edit, and save user profiles.
Front-end: Build a profile page where users can view and edit their data.

- Meet Someone New:
Back-end: Implement API for randomized profile matching (filtered by age, location, language).
Front-end: Create a matchmaking UI (e.g., "swipe"-style or carousel-like interaction).

- Messaging System (Inbox):
Back-end: Build APIs for sending and retrieving messages between users.
Front-end: Create a basic inbox and chat UI.

- Location Tracking:
Back-end: Integrate a free geolocation API (e.g., GeoDB Cities) for user location.
Front-end: Allow users to set their location for matching purposes.

- Sprint 3: January 16 – January 22
Refine core functionality and accessibility.

Tasks:
- UI/UX Enhancements:
Polish the landing page and all user-facing components.
Add tooltips, larger fonts, and accessible design elements for senior users.

- Error Handling:
Front-end: Display user-friendly error messages (e.g., invalid login, failed network requests).
Back-end: Add error-handling middleware to APIs.

- Sprint 4: January 23 – January 31
Test, deploy, and document the project.

Tasks:
- Testing:
Conduct unit testing for back-end APIs.
Perform end-to-end testing on the full app.
Fix bugs and optimize performance.

- Documentation:
Write a README with setup instructions, features, and usage guide.
Document API endpoints and provide example responses for clarity.

- Final Iteration:
Gather feedback from peers or seniors (if possible).
Make last-minute fixes and tweaks.

## Nice-to-haves

- Game feature: Game(s) to play together (with friends or with random local users that they can later "add as a friend")
- Further accessibility features:
-- Ability to undo actions
-- Closed captions
-- Adjustable volume where applicable
-- "Recent activity" log of the user's actions, for seniors with weak memory
- Inbox upgrades:
-- Sending images in chat 
-- Video calling feature (friends only)
-- Search function within chat
-- within inbox: notifications via a Moai bot in inbox rather than a notification tab, this bot will have a friendly name and demeanor but the user cannot respond
- Moai inbox bots (continued): 
-- create several that are specific to the type of notification (ie, a bot to message the user when they recieve a friend request, a different bot to message the user when there is a nearby event, etc)
-- a general help AI that the user can speak with to help navigate the app
- Personal notes section under each profile 
- Events:
-- Organize/RSVP events
-- Send to specific users, or filter for area and/or language
-- Users can be notified of nearby events (if the event coordinator selected that option)
- Ability to block people, remove friends
- Ability to delete an account
- Hover over a name to pop up a mini profile synopsis:
-- Name 
-- Age 
-- Location 
-- Languages 
- Outgoing friend requests can include a message from the user
