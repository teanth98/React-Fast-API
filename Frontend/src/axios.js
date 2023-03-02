import axios from "axios";

export default URL = axios.create({
  baseURL: "http://localhost:8000",
});
