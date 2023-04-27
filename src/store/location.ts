import { create } from "zustand";
import { RideClient } from "../api/type";

interface LocationState {
  departureLocationName: string;
  departureLocationCoor: number[];
  arrivalLocationName: string;
  arrivalLocationCoor: number[];
  setDepartureLocationCoor: (departureLocationCoor: number[]) => void;
  setArrivalLocationCoor: (arrivalLocationCoor: number[]) => void;
  setDepartureLocationName: (departureLocationName: string) => void;
  setArrivalLocationName: (arrivalLocationName: string) => void;
}

const useLocationStore = create<LocationState>((set) => ({
  departureLocationName: "",
  arrivalLocationName: "",
  departureLocationCoor: [],
  arrivalLocationCoor: [],
  setDepartureLocationCoor: (departureLocationCoor: number[]) =>
    set({ departureLocationCoor }),
  setArrivalLocationCoor: (arrivalLocationCoor: number[]) =>
    set({ arrivalLocationCoor }),
  setDepartureLocationName: (departureLocationName: string) =>
    set({ departureLocationName }),
  setArrivalLocationName: (arrivalLocationName: string) =>
    set({ arrivalLocationName }),
}));

export default useLocationStore;
