# CareSync 🏫

A comprehensive child care management platform built with the **MERN stack** (MongoDB, Express.js, React, Node.js). CareSync bridges the communication gap between parents, teachers, and administrators in childcare settings.

## Features

- **Role-Based Dashboards** — Separate interfaces for Admin, Teacher, and Parent roles
- **Child Management** — Register, track, and manage children's profiles
- **Attendance Tracking** — Daily attendance marking and history
- **Meal Management** — Plan and track daily meals
- **Activity Logs** — Record and monitor daily activities
- **Timetable Management** — Create and share class schedules
- **Real-Time Messaging** — Instant communication between parents and teachers via Socket.io
- **Notice Board** — Broadcast announcements to all users
- **OTP-Based Password Reset** — Secure password recovery via email

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, TailwindCSS       |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB Atlas (Mongoose ODM)       |
| Real-Time  | Socket.io                         |
| Auth       | JWT + Passport.js                  |
| Email      | Nodemailer                         |

## Project Structure

```
CareSync/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database & Passport config
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/      # Auth, error handling, logging
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Email utility
│   │   ├── views/            # EJS templates
│   │   ├── app.js            # Express app setup
│   │   ├── server.js         # Entry point
│   │   └── socket.js         # Socket.io setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth & Theme providers
│   │   ├── pages/            # Route pages
│   │   ├── App.jsx           # App router
│   │   └── main.jsx          # Entry point
│   └── package.json
└── package.json              # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nishant-0593/Care-Sync.git
   cd Care-Sync
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd Backend && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `Backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```

4. **Run the application**
   ```bash
   # Start backend (from Backend/)
   node src/server.js

   # Start frontend (from frontend/)
   npm run dev
   ```

   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## API Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| POST   | `/api/auth/register`   | Register a new user      |
| POST   | `/api/auth/login`      | Login                    |
| GET    | `/api/children`        | Get all children         |
| POST   | `/api/attendance`      | Mark attendance          |
| GET    | `/api/meals`           | Get meal plans           |
| GET    | `/api/activities`      | Get activity logs        |
| GET    | `/api/timetable`       | Get timetable            |
| POST   | `/api/messages`        | Send a message           |
| GET    | `/api/notices`         | Get all notices          |

## License

This project is for educational purposes.
