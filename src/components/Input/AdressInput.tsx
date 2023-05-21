import { AutoComplete } from "antd";
import { useState } from "react";
import { extractAddressAndCoordinates } from "../../helpers/extractAddressAndCoordinates";
import { type GeocodingDataClient } from "../../types/GeocodingData";
import useLocationStore from "../../store/location";

const mapboxApiKey =
  "pk.eyJ1IjoieWFkYXJvNGthIiwiYSI6ImNsZjdjZXdscTFkaTMzdG9jbnNhNTBiZ3cifQ.gbKXjjN-ea347B-MUmTuFA";

const AdressInput = ({
  placeholder,
  style,
  onSelect,
  setName,
}: {
  placeholder: string;
  style?: any;
  setName: (label: string) => void;
}) => {
  const [options, setOptions] = useState<GeocodingDataClient[]>([]);
  const [value, setValue] = useState<string>("");

  const handleChange = (data: string) => {
    setValue(data);
  };

  const handleSelect = (value: number[], options: GeocodingDataClient) => {
    setValue(options.label);
    onSelect(options.value);
    setName(options.label);
  };

  const handleSearch = () => {
    setOptions([]);
    setTimeout(() => {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value,
        )}.json?access_token=${mapboxApiKey}&country=RU&&types=region,place,locality,neighborhood,address`,
      )
        .then(async (response) => await response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            setOptions(extractAddressAndCoordinates(data.features));
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
        style={style}
        placeholder={placeholder}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        notFoundContent={"Нет результатов"}
      />
    </>
  );
};

export default AdressInput;
