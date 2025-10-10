Act as a software prinicpal architect who has deep understanding React-native, expo, backend using nodejs and typecript, sqlite and 3rd party apis like openstreetmap. You're proficiet in transforming requirement docs and mocks into full fledged product. 

## Project Overview
The Activity Logger is a webview-based Android application for startups to track employee activities and manage them. Employees can log activities with multimedia and text, while Admins can manage employees and monitor their activities and locations.

## Do not read folder
* node_modules and everything else mentioned in .gitignore

## Do not run commands rather ask the user to do it for you
* npm start
* npx expo start
* npm install

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
│   ├── _layout.tsx
│   ├── +not-found.tsx
│   ├── add-activity.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   └── services/
│       └── api.js
├── assets/
│   ├── fonts/
│   │   └── SpaceMono-Regular.ttf
│   └── images/
│       ├── adaptive-icon.png
│       ├── favicon.png
│       ├── icon.png
│       ├── partial-react-logo.png
│       ├── react-logo.png
│       ├── react-logo@2x.png
│       ├── react-logo@3x.png
│       └── splash-icon.png
├── backend/              # Node.js backend
│   ├── aclog.db
│   ├── package.json
│   ├── node_modules/...
│   └── src/
│       ├── server.js
│       ├── controllers/
│       │   ├── activityController.js
│       │   ├── adminController.js
│       │   ├── authController.js
│       │   │   ├── locationController.js
│       │   │   └── mediaController.js
│       │   │   └── workLogController.js
│       ├── models/
│       │   ├── Activity.js
│       │   ├── Location.js
│       │   └── User.js
│       ├── routes/
│       │   ├── activities.js
│       │   ├── admin.js
│       │   ├── auth.js
│       │   ├── location.js
│       │   ├── media.js
│       │   └── workLog.js
│       ├── services/
│       │   ├── cache/
│       │   │   ├── index.js
│       │   │   └── sqlite.js
│       │   └── database/
│       │       ├── index.js
│       │       └── sqlite.js
│       └── utils/
│           ├── auth.js
│           └── swagger.js
├── components/
│   ├── Collapsible.tsx
│   ├── ExternalLink.tsx
│   ├── HapticTab.tsx
│   ├── HelloWave.tsx
│   ├── ParallaxScrollView.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── ui/
│       ├── IconSymbol.ios.tsx
│       ├── IconSymbol.tsx
│       ├── TabBarBackground.ios.tsx
│       └── TabBarBackground.tsx
├── constants/
│   └── Colors.ts
├── hooks/
│   ├── useColorScheme.ts
│   ├── useColorScheme.web.ts
│   └── useThemeColor.ts
├── mocks/
│   ├── add-activity.png
│   ├── employees.png
│   ├── home.png
│   ├── login.png
│   ├── menu.png
│   └── register.png
├── node_modules/...
└── scripts/
    └── reset-project.js
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

### Media
*   `POST /api/media/upload`: Upload a media file.

### WorkLog
*   `POST /api/worklog`: Clock in or out for the day.

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
*   `latitude`: REAL (Optional latitude coordinate)
*   `longitude`: REAL (Optional longitude coordinate)
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

### WorkLog
*   `id`: INTEGER (Primary Key)
*   `user_id`: INTEGER (Foreign Key to Users)
*   `login_time`: DATETIME
*   `logout_time`: DATETIME
