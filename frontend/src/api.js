import axios from "axios";

// Ensures trailing slash does not cause double // in requests
const BASE_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

export const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});
