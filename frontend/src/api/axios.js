import axios from "axios";

// In Docker/production builds, VITE_API_URL is baked in at build time
// (see frontend/Dockerfile). Locally, npm run dev has no such env var
// set, so it falls back to the direct backend URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
});

// Automatically attach the logged-in user's access token to every
// request. Without this, every protected route (student/faculty/
// department CRUD) would need its own manual Authorization header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;