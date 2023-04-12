import React, { useEffect } from "react";
import { useQuery } from "react-query";

const RidesPage = () => {
  const { isLoading, error, data, isSuccess } = useQuery("rides", () =>
    fetch("http://localhost:3000/api/ride").then((res) => res.json())
  );
  console.log(data);

  if (isSuccess) {
    return (
      <div>
        <span>
          Поездка из {data[0].arrival_location[0]} в{" "}
          {data[0].arrival_location[1]}
        </span>
        <span>Дата:{data[0].departure_date}</span>
        <span>
          Мест свободно:{data[0].available_seats}/{data[0].total_seats}
        </span>
        <span>Цена:{data[0].price}</span>
      </div>
    );
  }
};

export default RidesPage;
