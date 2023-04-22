export interface GeocodingDataApi {
  center: number[];
  place_name: string;
}

export interface GeocodingDataClient {
  value: number[];
  label: string;
}
