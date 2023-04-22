interface UserData {
  id?: number;
  name: string;
  surname: string;
  phone: string;
  email: string;
}

export type User = UserData & {
  password: string;
  gender_id: number;
};

export type UserDto = UserData & {
  gender: string;
  isActivated: boolean;
};

export interface RideClient {
  id: string | number | null | undefined;
  status_id: string;
  driver_name?: string;
  driver_id?: number;
  total_seats: number;
  departure_location: number[];
  arrival_location: number[];
  departure_date: Date;
  available_seats: number;
  price: number;
  additional_details: undefined | string;
}
