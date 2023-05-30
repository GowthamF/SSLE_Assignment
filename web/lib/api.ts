import axios from "axios";

export const localApi = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const externalApi = axios.create({
  baseURL: "http://13.210.13.61/api",
});

export default localApi;
