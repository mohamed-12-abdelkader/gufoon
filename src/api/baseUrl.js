import axios from "axios";

const baseUrl = axios.create({
  baseURL: "https://api.gufoon.shop/",
});

export default baseUrl;
