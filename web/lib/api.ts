import axios from "axios";

export const localApi = axios.create({
  baseURL: "/api",
});

export const externalApi = axios.create({
  baseURL: "http://13.211.128.222/api",
});

export default localApi;
