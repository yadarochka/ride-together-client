import { create } from "zustand";
import { RideClient } from "../api/type";
import ApiRideClient from "../api/ApiRideClient";

interface RideState {
  rides: RideClient[];
  setRides: (rides: RideClient[]) => void;
}

const useRideStore = create<RideState>((set) => ({
  rides: [],
  setRides: (rides) => {
    try {
      set({ rides });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useRideStore;
