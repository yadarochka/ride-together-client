import React from "react";
import { Card, Descriptions } from "antd";
import dayjs from "dayjs";

const RidePage = () => {
  const trip = {
    departure_location: "Москва",
    arrival_location: "Санкт-Петербург",
    departure_date: dayjs("2023-05-01T10:30:00").format("DD.MM.YYYY HH:mm"),
    available_seats: 1,
    price: 1000,
    details: "Без дополнительных условий",
  };

  return (
    <Card title="Поездка">
      <Descriptions>
        <Descriptions.Item label="Откуда">
          {trip.departure_location}
        </Descriptions.Item>
        <Descriptions.Item label="Куда">
          {trip.arrival_location}
        </Descriptions.Item>
        <Descriptions.Item label="Дата отправления">
          {trip.departure_date}
        </Descriptions.Item>
        <Descriptions.Item label="Количество мест">
          {trip.available_seats}
        </Descriptions.Item>
        <Descriptions.Item label="Цена">{trip.price} ₽</Descriptions.Item>
        <Descriptions.Item label="Детали поездки">
          {trip.details}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default RidePage;
