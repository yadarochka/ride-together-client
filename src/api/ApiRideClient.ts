import axios from "axios";
import { RideClient, type User } from "./type";
import TokenService from "../helpers/token";

const $api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000/api/",
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + TokenService.getToken();
  return config;
});

type RideFilter = {
  maxPrice: number;
  minPrice: number;
  maxSeats: number;
  minSeats: number;
  // date: Date;
};

class ApiRideClient {
  static async createRide(ride: RideClient) {
    const response = await $api.post("/ride", ride);
    return await response.data;
  }

  static async getRides() {
    const response = await $api.get("/ride");
    return await response.data;
  }

  static async getRidesWithFilters(filters: RideFilter) {
    const response = await $api.post("/ride/filter", filters);
    return await response.data;
  }

  static async joinToToRide(ride_id: number, user_id: number) {
    const response = await $api.post("/ride/passengers", { ride_id, user_id });
    return await response.data;
  }

  static async getRidesFromUser(user_id: number | string) {
    console.log(user_id);
    const response = await $api.get("/ride/rides_from_user/" + user_id);
    return await response.data;
  }
}

export default ApiRideClient;
