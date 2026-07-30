import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
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