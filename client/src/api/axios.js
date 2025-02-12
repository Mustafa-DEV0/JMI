import axios from "axios";

const API = axios.create({
  baseURL: "https://jmi-backend.onrender.com",
});

export default API;
