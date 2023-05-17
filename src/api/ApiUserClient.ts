import axios from "axios";
import TokenService from "../helpers/token";
import { UserData } from "./type";

const $api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000/api/",
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + TokenService.getToken();
  return config;
});

class ApiUserClient {
  static async getUserProfile(id: number | string) {
    const response = await $api.get(`/profile/${id}`);
    return await response.data;
  }

  static async updateUserData(data: UserData & { gender_id: number }) {
    const response = await $api.patch(`/profile/${data.id}`, data);
    return await response.data;
  }
}

export default ApiUserClient;
