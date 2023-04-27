import { Button, Card, Progress, Tooltip } from "antd";
import Meta from "antd/es/card/Meta";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { red, green } from "@ant-design/colors";

interface CardOfRideProps {
  ride_id: number;
  from: string;
  to: string;
  price: number;
  available_seats: number;
  total_seats: number;
  departureTime: string;
  status: string;
}

const CardOfRide: FC<CardOfRideProps> = ({
  ride_id,
  from,
  to,
  price,
  available_seats,
  total_seats,
  departureTime,
  status,
}) => {
  const navigate = useNavigate();
  return (
    <Card
      title={`${from} - ${to}`}
      style={{ width: "100%", marginBottom: "10px" }}
    >
      <Meta description={`Цена: ${price} ₽`} />
      <p>
        Количество пассажиров:{" "}
        <Tooltip title={`Доступно ${available_seats} мест из ${total_seats}`}>
          <Progress
            showInfo={false}
            percent={(available_seats / total_seats) * 100}
            steps={total_seats}
            strokeColor={Array.from({ length: total_seats }, (_, i) => {
              if (i < available_seats) {
                return green[6];
              }
              return red[6];
            })}
          />
        </Tooltip>
      </p>
      <p>Время отправления: {departureTime}</p>
      <p>Статус: {status}</p>
      <Button
        type="primary"
        onClick={() => {
          navigate("/ride/" + ride_id);
        }}
      >
        Подробнее
      </Button>
    </Card>
  );
};

export default CardOfRide;
