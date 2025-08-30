## Activity Logger PRD

1. Introduction
This Product Requirements Document (PRD) outlines the features and functionalities of the Activity Logger mobile application, a webview-based Android application designed for early-stage startup environments. The application aims to facilitate activity tracking and employee management for both employees and administrators.

2. Product Overview
The Activity Logger app will provide a platform for employees to log their daily activities through multimedia content and text, fostering transparency and collaboration within the team. Administrators will have the ability to manage employee access and monitor daily activities and movements.

3. User Roles
The application will support two distinct user roles:
* Employee: Regular users who log activities, view feeds, and interact with posts.
* Admin: Users with elevated privileges to approve employee registrations and monitor employee activities and locations.

4. User Flows
    1.  Employee User Flow
    *   Registration
        *   Employee registers using their phone number and name.
    *   Login
        *   After approval by Admin, employees log in using their phone number and randomly generated OTP (One-Time-Password).
    *   Homepage:
        *   Displays a feed of all employee activities, ordered by timestamp (newest to oldest) and paginated in chunks of 5.
        *   Activity cards show employee name, captured image/video, and human-readable timestamp.
        *   Ability to open an activity and post comments.
        *   Hovering '+' button for adding a new activity.
    *   View Activity:
        *   Employees should be able to click on any of the activity cards from the feed, which will open the details page.
        *   The details page would show all the comments by other users.
        *   The Employees should be able to also put their comments on the activity.
    *   Add Activity:
        *   Page includes a placeholder for capturing media (photo/video), a title, and a description and current GPS coordinates in backgroud with Location permission 
    *   Menu:
        *   Employee image (editable).
        *   Employee name (unchangeable).
        *   Toggle button for "Login for the Day" / "Logout".
        *   Location capture initiates upon "Login for the Day" and stops upon "Logout". Location is captured every minute in the background and uploaded to the server.
    2.  Admin User Flow
    *   Login:
        *   Admin logs in with the same interface as an Employee.
    *   Homepage:
        *   Same interface as Employee.
    *   Menu:
        *   Same menu options as Employee, plus an additional "Employees" option.
    *   Employees Page (Admin Only):
        *   Displays a list of unapproved employees at the top, ordered by creation time.
        *   Displays a list of older employees, sorted by creation time.
        *   Clicking on an unapproved employee shows their phone number and name, with a toggle button for approval or rejection.
        *   Clicking on an approved employee opens a new page.
    *   Approved Employee Details Page (Admin Only):
        *   Dropdown for date selection.
        *   OpenStreetMap interface displaying employee movement between login and logout times for the selected date.
        *   Below the map, activities for the day are displayed in card form.
        *   Activity cards are clickable with the same functionality as the employee feed (open activity, post comment).

5. Features
    1.  Common Features (Admin & Employee)
        *   Webview-based Android Application: File
        *   Login/Logout: Phone number and OTP based login.
        *   Activity Feed: Displays activities from all employees, ordered by timestamp in chunks of 5.
        *   Activity Card Details: Employee name, captured media (image/video), human-readable timestamp.
        *   Commenting: Ability to post comments on activities.
        *   User Menu:
            *   Editable employee image.
            *   Non-editable employee name.
            *   Login/Logout toggle.
    2.  Employee Specific Features
        *   Registration: Phone number and name.
        *   Add Activity:
            *   Media capture (photo/video).
            *   Title and description fields.
        *   Background Location Capture:
            *   Starts upon "Login for the Day".
            *   Captures location every minute.
            *   Uploads location data to the server.
            *   Stops upon "Logout".
    3.  Admin Specific Features
        *   Employee Management:
            *   List of unapproved employees (ordered by creation time).
            *   List of approved employees (ordered by creation time).
            *   Approve/Reject toggle for unapproved employees.
        *   Employee Activity & Location Monitoring:
            *   Date selection for historical data.
            *   Map interface (OpenStreetMap) showing employee movement.
            *   Daily activity feed for selected employee and date.
