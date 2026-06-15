# Campus Activity Management System (CAMS)

## Project Overview

Campus Activity Management System is a platform for schools, colleges, and educational institutions to manage events and maintain students' co-curricular activity records.

The system supports two roles:

* Student
* Admin

### Goals

* Students can discover and register for events.
* Admins can manage events and participant records.
* Student participation history is permanently maintained.
* Certificates can be automatically generated and downloaded.

---

## Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* React Query
* Axios
* React Hook Form
* Zod
* Shadcn/UI

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* JWT
* Refresh Tokens

### Storage

* Cloudinary

### PDF Generation

* PDFKit or Puppeteer

---

## User Roles

### Student

* Register
* Login
* View Profile
* View Events
* Search Events
* Filter Events
* Register for Events
* View Participation History
* Download Certificates

### Admin

* Login
* Create Events
* Update Events
* Delete Events
* Upload Posters
* View Registrations
* Manage Results
* Generate Certificates
* View Analytics

---

## Database Models

### User

Fields:

* id
* fullName
* email
* password
* department
* academicYear
* role
* createdAt
* updatedAt

### Event

Fields:

* id
* title
* description
* category
* department
* venue
* date
* registrationDeadline
* posterUrl
* status
* createdBy
* createdAt
* updatedAt

### Registration

Fields:

* id
* studentId
* eventId
* registeredAt

### Result

Fields:

* id
* studentId
* eventId
* position
* certificateUrl
* createdAt

(Continue with the remaining requirements...)
