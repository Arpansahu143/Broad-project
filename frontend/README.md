# Frontend

React + Vite frontend for the University MIS project.

## Setup

```bash
copy .env.example .env
npm install
npm run dev
```

`VITE_API_URL` controls the backend URL. If it is not set, the app falls back
to `http://localhost:5000/api/v1` for local development.

## Build

```bash
npm run build
```

## Docker

The frontend Docker image builds static files with Vite and serves them through
nginx. In the root `docker-compose.yml`, nginx also proxies `/api/*` to the
backend service, so the default production-style value is:

```bash
VITE_API_URL=/api/v1
```
