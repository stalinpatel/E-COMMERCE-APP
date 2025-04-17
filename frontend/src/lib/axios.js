import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.mode === "developement" ? "http://localhost:5000/api" : "/api",
  withCredentials: true, //send cookies to the server
});

export default axiosInstance;
