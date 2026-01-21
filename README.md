# Lecture Scheduling Module (MERN Stack)

## Project Structure
- `Backend/`: Node.js + Express + MongoDB
- `Frontend/`: React + Vite + Tailwind CSS

## Prerequisites
- Node.js
- MongoDB (running locally on default port 27017)

## Setup Instructions

### 1. Backend Setup
```bash
cd Backend
npm install
# Create .env file (already included in generation)
# MONGO_URI=mongodb://localhost:27017/classmonitor
# JWT_SECRET=supersecret
# PORT=5001

# Seed the Database (Admin + Instructors)
node src/seed.js

# Start Server
npm start
# OR
node index.js
```

### 2. Frontend Setup
```bash
cd Frontend/my-react-app
npm install
npm run dev
```

## Credentials

### Admin
- **Email:** `admin@demo.com`
- **Password:** `admin123`

### Instructors
- **Email:** `rahul@demo.com`, `aisha@demo.com`, `om@demo.com`, `sara@demo.com`
- **Password:** `rahul123`, `aisha123`, `om123`, `sara123`

## Routes

### Frontend
- `/login`: Login page
- `/admin/courses`: Admin Dashboard (List Courses + Create Course)
- `/admin/courses/:id`: Course Detail + Schedule Lecture
- `/admin/instructors`: List Instructors
- `/instructor/dashboard`: View Assigned Lectures

### Backend API
- `POST /api/auth/login`
- `GET /api/admin/instructors`
- `GET /api/admin/courses`
- `POST /api/admin/courses`
- `GET /api/admin/courses/:id`
- `POST /api/admin/courses/:id/lectures` (Includes Conflict Check)
- `GET /api/admin/courses/:id/lectures`
- `GET /api/instructor/lectures`

## MongoDB Export/Import

### Export
```bash
mongodump --db classmonitor --out ./dump
```

### Import
```bash
mongorestore --db classmonitor ./dump/classmonitor
```
# ClassMonitor
