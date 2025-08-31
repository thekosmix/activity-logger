# Activity Logger API

This document provides examples of how to test the Activity Logger API endpoints using `curl`.

## Auth

### Register a new employee
* **Endpoint:** `POST /api/auth/register`
* **Sample Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{
  "name": "John Doe",
  "phone_number": "1234567890",
  "image": "http://example.com/image.png"
}'
```
* **Sample Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "phone_number": "1234567890",
  "is_approved": false,
  "is_admin": false,
  "image": "http://example.com/image.png"
}
```

### Login an employee
* **Endpoint:** `POST /api/auth/login`
* **Sample Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{
  "phone_number": "1234567890",
  "otp": "123456"
}'
```
* **Sample Response:**
```json
{
  "message": "Login successful",
  "token": "your_jwt_token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "phone_number": "1234567890",
    "is_approved": true,
    "is_admin": false,
    "image": "http://example.com/image.png"
  }
}
```

### Send OTP
* **Endpoint:** `POST /api/auth/sendOtp`
* **Sample Request:**
```bash
curl -X POST http://localhost:3000/api/auth/sendOtp -H "Content-Type: application/json" -d '{
  "phone_number": "1234567890"
}'
```
* **Sample Response:**
```json
{
  "message": "OTP sent successfully"
}
```

## Admin

### Get all employees
* **Endpoint:** `GET /api/admin/employees`
* **Sample Request:**
```bash
curl http://localhost:3000/api/admin/employees
```
* **Sample Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "phone_number": "1234567890",
    "is_approved": false,
    "is_admin": false,
    "image": "http://example.com/image.png"
  }
]
```

### Approve or reject an employee
* **Endpoint:** `POST /api/admin/approve`
* **Sample Request:**
```bash
curl -X POST http://localhost:3000/api/admin/approve -H "Content-Type: application/json" -d '{
  "id": 1,
  "is_approved": true
}'
```
* **Sample Response:**
```json
{
  "message": "Employee approval status updated"
}
```

## Activities

### Get the activity feed
* **Endpoint:** `GET /api/activities/feed`
* **Sample Request:**
```bash
curl http://localhost:3000/api/activities/feed?page=1&limit=10
```
* **Sample Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "title": "Team Lunch",
    "description": "Lunch at the new cafe",
    "media_url": "http://example.com/lunch.jpg",
    "timestamp": "2025-08-30T12:00:00.000Z"
  }
]
```

### Create a new activity
* **Endpoint:** `POST /api/activities`
* **Sample Request:**
```bash
curl -X POST http://localhost:3000/api/activities -H "Content-Type: application/json" -d '{
  "user_id": 1,
  "title": "Client Meeting",
  "description": "Meeting with Acme Corp",
  "media_url": "http://example.com/meeting.jpg"
}'
```
* **Sample Response:**
```json
{
  "id": 2,
  "user_id": 1,
  "title": "Client Meeting",
  "description": "Meeting with Acme Corp",
  "media_url": "http://example.com/meeting.jpg",
  "timestamp": "2025-08-30T14:00:00.000Z"
}
```

### Add a comment to an activity
* **Endpoint:** `POST /api/activities/:activityId/comments`
* **Sample Request:**
```bash
curl -X POST http://localhost:3000/api/activities/1/comments -H "Content-Type: application/json" -d '{
  "user_id": 1,
  "comment": "Great lunch!"
}'
```
* **Sample Response:**
```json
{
  "id": 1,
  "activity_id": 1,
  "user_id": 1,
  "comment": "Great lunch!",
  "timestamp": "2025-08-30T12:30:00.000Z"
}
```

## Location

### Update user's location
* **Endpoint:** `POST /api/location`
* **Sample Request:**
```bash
curl -X POST http://localhost:3000/api/location -H "Content-Type: application/json" -d '{
  "user_id": 1,
  "latitude": 34.0522,
  "longitude": -118.2437
}'
```
* **Sample Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "latitude": 34.0522,
  "longitude": -118.2437,
  "timestamp": "2025-08-30T15:00:00.000Z"
}
```

### Get user's location data
* **Endpoint:** `GET /api/location/:userId`
* **Sample Request:**
```bash
curl http://localhost:3000/api/location/1
```
* **Sample Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "latitude": 34.0522,
    "longitude": -118.2437,
    "timestamp": "2025-08-30T15:00:00.000Z"
  }
]
```
