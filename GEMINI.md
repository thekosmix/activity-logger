Act as a software prinicpal architect who has deep understanding React-native, expo, backend using nodejs and typecript, sqlite and 3rd party apis like openstreetmap. You're proficiet in transforming requirement docs and mocks into full fledged product. 

## Project Overview
The Activity Logger is a webview-based Android application for startups to track employee activities and manage them. Employees can log activities with multimedia and text, while Admins can manage employees and monitor their activities and locations.

## Do not read folder
node_modules and everything else mentioned in .gitignore

## Technology Stack
*   **App**: React-Native (with Expo)
*   **Backend**: Node.js (with Express.js)
*   **Database**: SQLite (with an interface for future replacement)
*   **Cache**: SQLite (with an interface for future replacement)
*   **API Documentation**: Swagger
*   **Mapping Service**: OpenStreetMap
*   **OTP Service**: Firebase

## Project Structure
```
/
├── app/                  # React-Native frontend
│   ├── screens/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Home.js
│   │   ├── AddActivity.js
│   │   ├── Menu.js
│   │   └── Admin/
│   │       ├── Employees.js
│   │       └── EmployeeDetails.js
│   ├── components/
│   │   ├── ActivityCard.js
│   │   └── Comment.js
│   └── services/
│       ├── api.js
│       └── location.js
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── activityController.js
│   │   │   ├── adminController.js
│   │   │   └── locationController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Activity.js
│   │   │   └── Location.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── activities.js
│   │   │   ├── admin.js
│   │   │   └── location.js
│   │   ├── services/
│   │   │   ├── cache/
│   │   │   │   ├── index.js
│   │   │   │   └── sqlite.js
│   │   │   └── database/
│   │   │       ├── index.js
│   │   │       └── sqlite.js
│   │   └── utils/
│   │       └── swagger.js
│   └── server.js
├── mocks/
└── Gemini.md
```

## API Endpoints

### Auth
*   `POST /api/auth/register`: Register a new employee.
*   `POST /api/auth/sendOtp`: Send OTP to a registered and approved user.
*   `POST /api/auth/login`: Login an employee with phone number and OTP.

### Admin
*   `GET /api/admin/employees`: Get all employees.
*   `POST /api/admin/approve`: Approve or reject an employee.

### Activities
*   `GET /api/activities/feed`: Get the activity feed (paginated).
*   `POST /api/activities`: Create a new activity.
*   `POST /api/activities/:activityId/comments`: Add a comment to an activity.

### Location
*   `POST /api/location`: Update user's location.
*   `GET /api/location/:userId`: Get user's location data.

## Database Schema

### Users
*   `id`: INTEGER (Primary Key)
*   `name`: TEXT
*   `phone_number`: TEXT (Unique)
*   `is_approved`: BOOLEAN
*   `is_admin`: BOOLEAN
*   `image`: TEXT

### Activities
*   `id`: INTEGER (Primary Key)
*   `user_id`: INTEGER (Foreign Key to Users)
*   `title`: TEXT
*   `description`: TEXT
*   `media_url`: TEXT
*   `timestamp`: DATETIME

### Comments
*   `id`: INTEGER (Primary Key)
*   `activity_id`: INTEGER (Foreign Key to Activities)
*   `user_id`: INTEGER (Foreign Key to Users)
*   `comment`: TEXT
*   `timestamp`: DATETIME

### Locations
*   `id`: INTEGER (Primary Key)
*   `user_id`: INTEGER (Foreign Key to Users)
*   `latitude`: REAL
*   `longitude`: REAL
*   `timestamp`: DATETIME
