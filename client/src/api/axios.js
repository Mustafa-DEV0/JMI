import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend URL
  withCredentials: true, // If using cookies for authentication
});

// Automatically add token if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
