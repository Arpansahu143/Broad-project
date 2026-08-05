# University MIS

Full-stack University Management Information System with a Node/Express API,
Prisma/PostgreSQL database, and React/Vite frontend.

## Completed Application Scope

- Auth, JWT sessions, refresh-token logout, and change-password API
- Role-based access for Admin, Faculty, and Student
- Student, Faculty, Department, Course, Attendance, Notification, and Report modules
- Student self-enrollment through the Course module
- Admin, Faculty, and Student frontend dashboards wired to real backend APIs
- Rate limiting, `hpp`, `helmet`, validation, and centralized error handling
- Jest smoke tests for auth and RBAC

## Local Development

Backend:

```bash
cd backend
copy .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Frontend:

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

## Docker

Create a root `.env` file from `.env.example`, change the secrets, then run:

```bash
docker compose up --build
```

Defaults:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000/api/v1`
- Postgres: internal Docker network only

The backend container runs `prisma migrate deploy` before starting.

## Still Out Of Scope

- Examination, Result, Fee, Library, and Hostel modules
- Swagger documentation
- Email password reset
- File upload/profile image storage
- Production monitoring
