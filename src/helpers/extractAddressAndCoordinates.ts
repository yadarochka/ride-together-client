import {
  type GeocodingDataApi,
  type GeocodingDataClient,
} from "../types/GeocodingData";

export function extractAddressAndCoordinates(
  data: GeocodingDataApi[],
): GeocodingDataClient[] {
  const result: GeocodingDataClient[] = [];
  for (let i = 0; i < data.length; i++) {
    result.push({ value: data[i].center, label: data[i].place_name });
  }
  return result;
}
