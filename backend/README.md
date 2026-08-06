# Backend

Express + Prisma API for the University MIS project.

## Main Modules

- `auth`: register, login, logout, admin-create-user, change-password
- `student`: CRUD and logged-in student profile
- `faculty`: CRUD and logged-in faculty profile
- `department`: CRUD and statistics
- `course`: CRUD, faculty/student "my courses", student enroll/unenroll
- `attendance`: faculty/admin marking and student attendance summary
- `notification`: admin broadcast and authenticated reads
- `report`: admin dashboard summary

## Setup

```bash
copy .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

The required environment variables are documented in `.env.example`.

## Tests

```bash
npm test
```

The current suite covers auth and RBAC smoke flows. Broader module-level tests
are still a future improvement.

## Production

The included `Dockerfile` is intended to be run through the root
`docker-compose.yml`, which starts Postgres, runs `prisma migrate deploy`, and
then starts the API.
