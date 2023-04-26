import React, { useEffect, useState } from "react";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  List,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import RideMap from "../../components/Map/Map";

const passengers = [
  {
    name: "John Smith",
    age: 35,
    nationality: "American",
    seatNumber: "12A",
  },
  {
    name: "Alice Johnson",
    age: 28,
    nationality: "British",
    seatNumber: "11B",
  },
  {
    name: "Mohammed Ali",
    age: 42,
    nationality: "Egyptian",
    seatNumber: "10C",
  },
];

const RidePage = () => {
  const trip = {
    departure_location: "Москва",
    arrival_location: "Санкт-Петербург",
    departure_date: dayjs("2023-05-01T10:30:00").format("DD.MM.YYYY HH:mm"),
    available_seats: 1,
    price: 1000,
    details: "Без дополнительных условий",
  };

  const [isAffixed, setIsAffixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsAffixed(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Card title="Поездка" style={{ marginBottom: "15px" }}>
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
          <Descriptions.Item>
            <Button
              type="primary"
              onClick={() => message.success("Вы присоединились к поездке!")}
            >
              Присоединиться к поездке!
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title={"Информация о попутчиках"} style={{ marginBottom: "15px" }}>
        <List header={<Typography.Text strong>Водитель</Typography.Text>}>
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${0}`}
                />
              }
              title={"driver_name"}
              description={`Age:`}
            />
          </List.Item>
        </List>
        <List
          header={<Typography.Text strong>Пассажиры</Typography.Text>}
          itemLayout="horizontal"
          dataSource={passengers}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${
                      index + 1
                    }`}
                  />
                }
                title={item.name}
                description={`Age: ${item.age}, Nationality: ${item.nationality}, Seat Number: ${item.seatNumber}`}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card title={"Маршрут"}>
        <RideMap
          pointA={[37.6156, 55.7522]}
          pointB={[30.185, 59.5619]}
        ></RideMap>
      </Card>
      <Button
        onClick={() => message.success("Вы присоединились к поездке!")}
        type="primary"
        style={{
          position: "fixed",
          bottom: 40,
          right: 40,
          opacity: isAffixed ? 1 : 0,
        }}
      >
        Присоединиться к поездке!
      </Button>
    </>
  );
};

export default RidePage;
