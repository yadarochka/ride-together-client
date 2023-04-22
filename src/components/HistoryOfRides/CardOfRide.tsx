import { Button, Card } from "antd";
import Meta from "antd/es/card/Meta";
import { FC } from "react";

type CardOfRideProps = {
  from: string;
  to: string;
  price: number;
  passengers: number;
  departureTime: string;
  status: string;
};

const CardOfRide: FC<CardOfRideProps> = ({
  from,
  to,
  price,
  passengers,
  departureTime,
  status,
}) => {
  return (
    <Card
      title={`${from} - ${to}`}
      style={{ width: "100%", marginBottom: "10px" }}
    >
      <Meta description={`Цена: ${price} ₽`} />
      <p>Количество пассажиров: {passengers}</p>
      <p>Время отправления: {departureTime}</p>
      <p>Статус: {status}</p>
      <Button type="primary">Подробнее</Button>
    </Card>
  );
};

export default CardOfRide;
