import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

const API = axios.create({
  baseURL: `${baseURL}/api/`,
});

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("jobportal_user"));

  if (user?.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
