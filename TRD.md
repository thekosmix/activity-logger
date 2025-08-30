## Technical Requirements
**App**: Android (Webview based). Should be React-Native based and should be runnable/testable using expo.
**Backend**: To support user authentication, activity storage, location data, and admin functionalities. It should be in nodejs. It should clearly expose APIs and have api documenentation with swagger.
**Cache**: For storing session storage after successful authentication. It should be done in sqlite but should be done through an interface, so that in future it can be changed to Redis or other in-memory storage.
**Database**: For storing user information, activity data, and location logs. It should be sqlite so that it can be used as an embedded database. But should be backed with an interface making it easier to change the database in future to MySQL or anything else.
**APIs**: For communication between the mobile app and the backend.
**Mapping Service Integration**: OpenStreetMap API.
