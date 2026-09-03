import axios from "axios";

const baseUrl = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/"
      : "https://api.gufoon.shop/",
});

export default baseUrl;
