# CAMS API Specification

## 1. API Design Strategy

*   **RESTful Conventions**: Resources are represented as nouns, pluralized (e.g., `/events`, `/users`).
*   **URL Naming Patterns**: Lowercase, kebab-case (e.g., `/api/events/:eventId/register`).
*   **HTTP Methods Mapping**:
    *   `GET`: Retrieve resources.
    *   `POST`: Create new resources or perform actions.
    *   `PUT`/`PATCH`: Update existing resources.
    *   `DELETE`: Remove resources.
*   **Versioning Strategy**: All API endpoints are prefixed with `/api/v1` (currently simplified to `/api` for MVP, but assumed v1).
*   **Request/Response Format**: JSON (`application/json`).
*   **Consistent Response Envelope**:
    ```json
    {
      "success": boolean,
      "data": any,
      "message": string,
      "error"?: object
    }
    ```
*   **Pagination Format**:
    ```json
    {
      "data": [],
      "pagination": {
        "page": number,
        "limit": number,
        "total": number,
        "totalPages": number
      }
    }
    ```
*   **Error Response Format**:
    ```json
    {
      "success": false,
      "message": string,
      "errors"?: [
        { "field": "string", "message": "string" }
      ]
    }
    ```
*   **HTTP Status Code Usage Table**:

| Code | Method | Description |
|---|---|---|
| 200 | GET, PUT, POST | OK. Successful request. |
| 201 | POST | Created. Resource successfully created. |
| 204 | DELETE | No Content. Resource successfully deleted. |
| 400 | Any | Bad Request. Validation error or malformed request. |
| 401 | Any | Unauthorized. Missing or invalid authentication token. |
| 403 | Any | Forbidden. User does not have necessary permissions (Role). |
| 404 | GET, PUT, DELETE | Not Found. Resource does not exist. |
| 409 | POST, PUT | Conflict. Resource already exists (e.g., email, registration). |
| 422 | POST, PUT | Unprocessable Entity. Validation failed. |
| 429 | Any | Too Many Requests. Rate limit exceeded. |
| 500 | Any | Internal Server Error. Unexpected server failure. |

---

## 2. Authentication Endpoints

### POST /api/auth/register
*   **Description**: Register a new student account
*   **Access**: Public
*   **Request body**:
    ```json
    {
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "password": "securepassword123",
      "department": "Computer Science",
      "academicYear": "SY"
    }
    ```
*   **Validation rules**:
    *   `email`: Valid email format.
    *   `password`: Minimum 8 characters.
    *   `fullName`, `department`, `academicYear`: Required, non-empty.
*   **Success response (201)**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": { "id": "uuid", "fullName": "John Doe", "email": "john.doe@example.com", "role": "STUDENT" },
        "accessToken": "jwt_token_here",
        "refreshToken": "refresh_token_here"
      }
    }
    ```
*   **Error responses**: 400 (validation), 409 (email exists)

### POST /api/auth/login
*   **Description**: Login with email and password
*   **Access**: Public
*   **Request body**:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securepassword123"
    }
    ```
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "user": { "id": "uuid", "fullName": "John Doe", "email": "john.doe@example.com", "role": "STUDENT" },
        "accessToken": "jwt_token_here",
        "refreshToken": "refresh_token_here"
      }
    }
    ```
*   **Error responses**: 400, 401 (invalid credentials)

### POST /api/auth/refresh
*   **Description**: Refresh access token
*   **Access**: Public (with valid refresh token)
*   **Request body**:
    ```json
    {
      "refreshToken": "valid_refresh_token_here"
    }
    ```
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Token refreshed successfully",
      "data": {
        "accessToken": "new_jwt_token_here",
        "refreshToken": "new_refresh_token_here"
      }
    }
    ```
*   **Error responses**: 401 (invalid/expired token)

### POST /api/auth/logout
*   **Description**: Logout and invalidate refresh token
*   **Access**: Authenticated
*   **Request body**:
    ```json
    {
      "refreshToken": "refresh_token_to_invalidate"
    }
    ```
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Logged out successfully",
      "data": null
    }
    ```

---

## 3. User Endpoints

### GET /api/users/profile
*   **Description**: Get current user's profile
*   **Access**: Authenticated (Student, Admin)
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Profile retrieved",
      "data": {
        "id": "uuid",
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "department": "Computer Science",
        "academicYear": "SY",
        "role": "STUDENT",
        "createdAt": "2023-10-27T10:00:00Z"
      }
    }
    ```

### PUT /api/users/profile
*   **Description**: Update current user's profile
*   **Access**: Authenticated
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Request body**:
    ```json
    {
      "fullName": "Johnathan Doe",
      "department": "Information Technology",
      "academicYear": "TY"
    }
    ```
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Profile updated",
      "data": {
        "id": "uuid",
        "fullName": "Johnathan Doe",
        "email": "john.doe@example.com",
        "department": "Information Technology",
        "academicYear": "TY",
        "role": "STUDENT",
        "createdAt": "2023-10-27T10:00:00Z"
      }
    }
    ```

---

## 4. Event Endpoints

### GET /api/events
*   **Description**: List all events with search, filter, pagination
*   **Access**: Public or Authenticated
*   **Query params**:
    *   `page` (number, default: 1)
    *   `limit` (number, default: 10)
    *   `search` (string)
    *   `category` (string: TECHNICAL, CULTURAL, etc.)
    *   `department` (string)
    *   `status` (string: UPCOMING, ONGOING, etc.)
    *   `sortBy` (string: date, createdAt, title)
    *   `sortOrder` (string: asc, desc)
    *   `startDate` (ISO string)
    *   `endDate` (ISO string)
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Events retrieved",
      "data": [
        {
          "id": "uuid",
          "title": "Tech Symposium 2024",
          "category": "TECHNICAL",
          "date": "2024-05-15T09:00:00Z",
          "status": "UPCOMING"
        }
      ],
      "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
    }
    ```

### GET /api/events/:id
*   **Description**: Get single event details
*   **Access**: Public or Authenticated
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Event retrieved",
      "data": {
        "id": "uuid",
        "title": "Tech Symposium 2024",
        "description": "Annual technical festival...",
        "category": "TECHNICAL",
        "department": "CS",
        "venue": "Main Auditorium",
        "date": "2024-05-15T09:00:00Z",
        "registrationDeadline": "2024-05-10T23:59:59Z",
        "posterUrl": "https://res.cloudinary.com/...",
        "status": "UPCOMING",
        "registrationCount": 120
      }
    }
    ```
*   **Error**: 404

### POST /api/events
*   **Description**: Create a new event
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Request body**:
    ```json
    {
      "title": "Hackathon 2024",
      "description": "24-hour coding challenge",
      "category": "TECHNICAL",
      "department": "CS",
      "venue": "Lab 1 & 2",
      "date": "2024-06-01T09:00:00Z",
      "registrationDeadline": "2024-05-25T23:59:59Z",
      "status": "UPCOMING"
    }
    ```
*   **Success response (201)**:
    ```json
    {
      "success": true,
      "message": "Event created",
      "data": { "id": "uuid", "title": "Hackathon 2024", "..." : "..." }
    }
    ```

### PUT /api/events/:id
*   **Description**: Update an event
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Request body**: Partial fields
*   **Success response (200)**: Updated event object
*   **Error**: 404, 403

### DELETE /api/events/:id
*   **Description**: Delete an event
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Event deleted successfully",
      "data": null
    }
    ```
*   **Error**: 404, 403

### POST /api/events/:id/poster
*   **Description**: Upload/update event poster
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`, `Content-Type: multipart/form-data`
*   **Request body**: Form-data with key `poster` (file)
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Poster uploaded",
      "data": { "posterUrl": "https://res.cloudinary.com/..." }
    }
    ```

---

## 5. Registration Endpoints

### POST /api/events/:eventId/register
*   **Description**: Register current student for an event
*   **Access**: Student only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Validation**: deadline not passed, not already registered, event not cancelled
*   **Success response (201)**:
    ```json
    {
      "success": true,
      "message": "Registration successful",
      "data": {
        "id": "uuid",
        "studentId": "uuid",
        "eventId": "uuid",
        "registeredAt": "2024-01-10T10:00:00Z"
      }
    }
    ```
*   **Errors**: 400 (deadline passed), 409 (already registered), 404 (event not found)

### DELETE /api/events/:eventId/register
*   **Description**: Cancel registration
*   **Access**: Student only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Validation**: event hasn't started
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Registration cancelled",
      "data": null
    }
    ```

### GET /api/events/:eventId/registrations
*   **Description**: List all registrations for an event
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Query params**: `page`, `limit`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Registrations retrieved",
      "data": [
        {
          "id": "uuid",
          "registeredAt": "2024-01-10T10:00:00Z",
          "student": {
            "id": "uuid",
            "fullName": "John Doe",
            "email": "john.doe@example.com"
          }
        }
      ],
      "pagination": { "page": 1, "limit": 10, "total": 120, "totalPages": 12 }
    }
    ```

### GET /api/users/registrations
*   **Description**: Get current student's registration history
*   **Access**: Student only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Registration history retrieved",
      "data": [
        {
          "id": "uuid",
          "registeredAt": "2024-01-10T10:00:00Z",
          "event": {
            "id": "uuid",
            "title": "Tech Symposium 2024",
            "date": "2024-05-15T09:00:00Z",
            "status": "COMPLETED"
          }
        }
      ]
    }
    ```

---

## 6. Result Endpoints

### POST /api/events/:eventId/results
*   **Description**: Add results for an event
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Request body**:
    ```json
    {
      "results": [
        { "studentId": "uuid_1", "position": "1st" },
        { "studentId": "uuid_2", "position": "2nd" },
        { "studentId": "uuid_3", "position": "Participant" }
      ]
    }
    ```
*   **Validation**: students must be registered, event must be completed
*   **Success response (201)**:
    ```json
    {
      "success": true,
      "message": "Results added successfully",
      "data": null
    }
    ```

### GET /api/events/:eventId/results
*   **Description**: Get results for an event
*   **Access**: Authenticated
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Results retrieved",
      "data": [
        {
          "id": "uuid",
          "position": "1st",
          "student": { "id": "uuid", "fullName": "John Doe" },
          "certificateUrl": "https://..."
        }
      ]
    }
    ```

### PUT /api/events/:eventId/results/:resultId
*   **Description**: Update a result
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Request body**: `{ "position": "3rd" }`
*   **Success response (200)**: Updated result object

### GET /api/users/results
*   **Description**: Get current student's results
*   **Access**: Student only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Results retrieved",
      "data": [
        {
          "id": "uuid",
          "position": "1st",
          "certificateUrl": "https://...",
          "event": { "title": "Tech Symposium 2024", "date": "2024-05-15T09:00:00Z" }
        }
      ]
    }
    ```

---

## 7. Certificate Endpoints

### POST /api/events/:eventId/certificates/generate
*   **Description**: Generate certificates for all results of an event
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Certificate generation started in background",
      "data": null
    }
    ```

### GET /api/certificates/:resultId/download
*   **Description**: Download a certificate
*   **Access**: Student (own certificate) or Admin
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Response**: Returns PDF file or redirect to Cloudinary URL

---

## 8. Analytics Endpoints (Admin)

### GET /api/analytics/overview
*   **Description**: Dashboard analytics
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Analytics retrieved",
      "data": {
        "totalStudents": 1500,
        "totalEvents": 45,
        "totalRegistrations": 3200,
        "upcomingEvents": 5,
        "completedEvents": 40,
        "categoryBreakdown": { "TECHNICAL": 20, "CULTURAL": 15, "SPORTS": 10 },
        "departmentBreakdown": { "CS": 1200, "IT": 1000 },
        "recentRegistrations": []
      }
    }
    ```

### GET /api/analytics/events/:eventId
*   **Description**: Per-event analytics
*   **Access**: Admin only
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success response (200)**:
    ```json
    {
      "success": true,
      "message": "Event analytics retrieved",
      "data": {
        "registrationCount": 120,
        "departmentWise": { "CS": 80, "IT": 40 },
        "resultsSummary": { "1st": 1, "2nd": 1, "3rd": 1, "Participant": 117 }
      }
    }
    ```

---

## 9. Common Headers

*   `Content-Type`: `application/json`
*   `Authorization`: `Bearer <accessToken>`
*   For file uploads: `Content-Type`: `multipart/form-data`

---

## 10. Rate Limiting

*   **Auth**: 5 requests/minute
*   **General API**: 100 requests/minute
*   **File uploads**: 10 requests/minute

---

## 11. Error Codes Reference

| Error Code | HTTP Status | Message | Description |
|---|---|---|---|
| `VALIDATION_ERROR` | 400/422 | Invalid input data | Request body or params failed Zod validation |
| `UNAUTHORIZED` | 401 | Authentication required | Missing, invalid, or expired access token |
| `FORBIDDEN` | 403 | Access denied | User lacks required role (e.g., Student trying to access Admin route) |
| `NOT_FOUND` | 404 | Resource not found | The requested entity (Event, User, etc.) does not exist |
| `EMAIL_IN_USE` | 409 | Email already registered | Attempting to register with an existing email |
| `ALREADY_REGISTERED` | 409 | Already registered for event | Student is already registered for this event |
| `DEADLINE_PASSED` | 400 | Registration deadline passed | Attempting to register after the deadline |
| `EVENT_CANCELLED` | 400 | Event is cancelled | Attempting to register for a cancelled event |
| `RATE_LIMIT_EXCEEDED`| 429 | Too many requests | Client exceeded rate limits |
| `INTERNAL_ERROR` | 500 | Internal server error | Unexpected error during request processing |
