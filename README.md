## Demo Video

[Watch Sweety – Blood Glucose Tracker Demo] https://drive.google.com/file/d/1R9PxLdSgCYfOg1LZCLejdBVNyo5c8N8d/view?usp=drive_link

# Sweety – Blood Glucose Tracker

Sweety is a full-stack blood glucose tracking application that helps users record, manage, and monitor their daily glucose readings. Users can view daily, month-to-date, and previous-month reports with key statistics.

## Features

- User registration and login with password hashing.
- JWT-based authentication for protected API routes.
- Create, view, update, and delete glucose readings.
- Four daily reading slots:
  - Morning Fasting
  - After Breakfast
  - After Lunch
  - After Dinner
- Input validation for glucose values (40–600 mg/dl).
- Prevents duplicate readings for the same slot on the same day.
- Prevents future-dated readings.
- Daily, month-to-date, and previous-month reports.
- Highest, lowest, average, and total reading statistics.
- User-specific data access.
- Responsive React interface with glucose charts.

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- Recharts
- Lucide React

**Backend**
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod

## Project Structure

```text
sweety-glucose-tracker/
├── client/                 # React frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── utils/
│
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
│
└── README.md
```

## Prerequisites

Install the following before running the application:

- Node.js
- npm
- PostgreSQL

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Kirubapanneers/sweety-glucose-tracker.git
cd sweety-glucose-tracker
```

### 2. Set up the PostgreSQL database

Create a PostgreSQL database named:

```sql
CREATE DATABASE sweety_db;
```

### 3. Configure the backend

Open the server directory:

```bash
cd server
npm install
```

Create your local environment file from the example:

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Update `server/.env` with your PostgreSQL credentials and a secure JWT secret:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/sweety_db?schema=public"
JWT_SECRET="your_secure_jwt_secret"
PORT=5000
```

### 4. Apply database migrations

Run:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 5. Seed sample data

Run:

```bash
npm run seed
```

This creates a demo user and sample glucose readings for the last seven days.

**Demo account**

- Email: `demo@sweety.com`
- Password: `SweetyDemo123!`

### 6. Start the backend

```bash
npm run dev
```

Backend URL: `http://localhost:5000`

Health check: `http://localhost:5000/api/health`

### 7. Set up and start the frontend

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:

`http://localhost:5173`

The frontend communicates with the backend at `http://localhost:5000/api`.

## API Endpoints

All reading and report endpoints require JWT authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API and database health check |
| POST | `/api/readings` | Create a glucose reading |
| GET | `/api/readings` | Get the user's readings |
| GET | `/api/readings?date=YYYY-MM-DD` | Get readings for a selected date |
| PUT | `/api/readings/:id` | Update a reading |
| DELETE | `/api/readings/:id` | Delete a reading |
| GET | `/api/reports/daily` | Daily report |
| GET | `/api/reports/month-to-date` | Month-to-date report |
| GET | `/api/reports/previous-month` | Previous-month report |

Daily and month-to-date reports accept an optional `date=YYYY-MM-DD` query parameter.

Authentication endpoints are available under `/api/auth`.

## Validation and Data Integrity

- Glucose values must be whole numbers between 40 and 600 mg/dl.
- Dates must be valid and cannot be in the future.
- Only the four supported reading slots are accepted.
- A user can have only one reading per slot per day.
- A database-level unique constraint enforces the user/date/slot combination.
- API queries scope readings to the authenticated user.
- Passwords are hashed using bcrypt.

## Running Tests

From the server directory:

```bash
npm test
```

The backend test suite uses Node.js's built-in test runner.

## Notes

- Each user can access and manage only their own glucose readings.
- Daily reports summarize readings for the selected date.
- Month-to-date reports cover the first day of the selected month through the selected date.
- Previous-month reports cover the entire previous calendar month.
- Average glucose values are rounded to one decimal place.
- Reports display an appropriate empty state when no readings are available.
- The seed script can be run again without duplicating existing readings for the same user, date, and slot.

## Future Improvements

- Pagination for reading history.
- Additional glucose trend visualizations.
- Automated frontend tests.
- Docker-based deployment.
- Optional Redis caching.
