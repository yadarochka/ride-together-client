import {
  type GeocodingDataApi,
  type GeocodingDataClient,
} from "../types/GeocodingData";

export function extractAddressAndCoordinates(
  data: GeocodingDataApi[],
): GeocodingDataClient[] {
  const result: GeocodingDataClient[] = [];
  for (let i = 0; i < data.length; i++) {
    result.push({
      value: data[i].center,
      label: extractAddress(data[i].context) + " " + data[i].text,
    });
  }
  return result;
}

type Context = {
  id: string;
  text: string;
};

function extractAddress(context: Context[]) {
  let result = "";
  for (let obj of context) {
    if (obj.id.startsWith("postcode") || obj.id.startsWith("country")) {
      continue;
    }
    result += obj.text + ", ";
  }
  return result;
}
