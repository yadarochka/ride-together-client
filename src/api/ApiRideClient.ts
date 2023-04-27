import axios from "axios";
import { type RideClient, type User } from "./type";
import TokenService from "../helpers/token";

const $api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:5000/api/",
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = "Bearer " + TokenService.getToken();
  return config;
});

interface RideFilter {
  maxPrice: number;
  minPrice: number;
  maxSeats: number;
  minSeats: number;
  // date: Date;
}

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

  static async leaveFromRide(
    ride_id: number | string,
    user_id: number | string,
  ) {
    const response = await $api.post("/ride/passengers/leave", {
      ride_id,
      user_id,
    });
    return await response.data;
  }

  static async getRidesFromUser(user_id: number | string) {
    const response = await $api.get("/ride/rides_from_user/" + user_id);
    return await response.data;
  }

  static async getRideById(ride_id: number) {
    const response = await $api.get("/ride/" + ride_id);
    return await response.data;
  }

  static async getPassengers(ride_id: number) {
    const response = await $api.get("/ride/passengers/" + ride_id);
    return await response.data;
  }

  static async inRide(ride_id: number | string, user_id: number | string) {
    const response = await $api.post("/ride/user-in-ride/" + ride_id, {
      user_id,
    });
    return await response.data;
  }

  static async cancelRide(ride_id: number | string) {
    const response = await $api.put("/ride/" + ride_id);
    return await response.data;
  }
}

export default ApiRideClient;
