import axios from "axios";

const api = axios.create({
  baseURL: "http://54.79.234.249/api",
});

export default api;
