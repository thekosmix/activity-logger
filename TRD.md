## Technical Requirements
**App**: Android (Webview based). Should be React-Native based and should be runnable/testable using expo.
**Backend**: To support user authentication, activity storage, location data, and admin functionalities. It should be in nodejs. It should clearly expose APIs as defined below and have api documenentation with swagger.
   * /auth/login: The login page for all users. This is the initial page for the
     application.
   * /auth/register: The registration page for new users to create an account.
   * /main: The main activity feed page that users see after logging in. It displays a
     stream of activities from all users.
   * /main/add-activity: The page where users can create and submit a new activity post,
     including a title, description, and media.
   * /admin: The admin dashboard, accessible only to users with the "Admin" role. It's used
     for managing employees.
   * /admin/employee/[id]: A dynamic page showing the details for a specific employee. For
     example, /admin/employee/123 would show the details for the employee with the ID 123.
   * /auth/auth/sendOtp: Handles the sending of an OTP for a registered and approved phoneNumber. The Otp is stored in the cache for 10 minutes. The OTP should be sent using Firebase.
   * /api/auth/login: Handles the user login authentication matching it with sentOtp and phoneNumber. After succesful login, user should see the homepage.
   * /api/auth/register: Handles the creation of a new user account.
   * /api/admin/employees: Fetches the list of all employees for the admin dashboard.
   * /api/admin/approve: Handles the approval or rejection of an employee by an admin.
   * /api/activities: Used for creating new activities and fetching a list of all
     activities.
   * /api/activities/feed: Fetches the paginated activity feed for the main page.
   * /api/activities/[activityId]/comments: A dynamic route to manage comments for a
     specific activity.
   * /api/location: Used for managing user location data.
   * /api/location/[userId]: A dynamic route to manage the location data for a specific
     user.
   * /api/media/upload: Upload a media file.
   * /api/worklog: Clock in or out for the day.
**Cache**: For storing session storage after successful authentication. It should be done in sqlite but should be done through an interface, so that in future it can be changed to Redis or other in-memory storage.
**Database**: For storing user information, activity data, and location logs. It should be sqlite so that it can be used as an embedded database. But should be backed with an interface making it easier to change the database in future to MySQL or anything else.
**APIs**: For communication between the mobile app and the backend.
**Mapping Service Integration**: OpenStreetMap API.
