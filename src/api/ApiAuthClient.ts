import axios from "axios";
import { type User } from "./type";

class ApiAuthClient {
  baseURL = "http://localhost:5000/api/auth/";
  $api;

  constructor() {
    this.$api = axios.create({ withCredentials: true, baseURL: this.baseURL });
  }

  async register(newUserData: User) {
    const response = await fetch(this.baseURL + "register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData),
      credentials: "include",
    });
    return await response.json();
  }

  async login(email: string, password: string) {
    const response = await this.$api.post("/login", { email, password });
    return await response.data;
  }

  async refresh() {
    const response = await this.$api.get("/refresh");
    return await response.data;
  }
}

export default new ApiAuthClient();
