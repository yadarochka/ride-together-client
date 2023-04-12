import { AutoComplete } from "antd";
import { useState } from "react";
import { extractAddressAndCoordinates } from "../../helpers/extractAddressAndCoordinates";
import { GeocodingDataClient } from "../../types/GeocodingData";

const mapboxApiKey =
  "pk.eyJ1IjoieWFkYXJvNGthIiwiYSI6ImNsZjdjZXdscTFkaTMzdG9jbnNhNTBiZ3cifQ.gbKXjjN-ea347B-MUmTuFA";

const AdressInput = ({
  placeholder,
  style,
}: {
  placeholder: string;
  style: any;
}) => {
  const [options, setOptions] = useState<GeocodingDataClient[]>([]);
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (data: string) => {
    setValue(data);
  };

  const handleSelect = (value: number[], options: GeocodingDataClient) => {
    setValue(options.label);
  };

  const handleSearch = () => {
    console.log("ss");
    setIsLoading(true);
    setIsDirty(true);

    setTimeout(() => {
      let coordinates = [];

      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${mapboxApiKey}&country=RU&&types=region,place,locality,neighborhood,address`
      )
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          if (data.features && data.features.length > 0) {
            console.log(data.features);
            setOptions(extractAddressAndCoordinates(data.features));
          } else {
            console.log(`No coordinates found for "${value}"`);
          }
        });
    }, 1000);
  };

  return (
    <>
      <AutoComplete
        value={value}
        options={options}
        onSearch={handleSearch}
        onChange={handleChange}
        onSelect={handleSelect}
        style={{ width: 300 }}
        placeholder={placeholder}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        notFoundContent={
          isLoading && isDirty ? "Загрузка..." : "Нет результатов"
        }
        style={{
          width: "100%",
        }}
      />
    </>
  );
};

export default AdressInput;
