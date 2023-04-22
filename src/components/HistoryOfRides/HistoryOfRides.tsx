import { useEffect, useState } from "react";
import { Card, Tabs, TabsProps, message } from "antd";
import ApiRideClient from "../../api/ApiRideClient";
import useAppStore from "../../store/app";
import CenteredSpin from "../CenteredSpin/CenteredSpin";
import CardOfRide from "./CardOfRide";
import { RideClient } from "../../api/type";
import dayjs from "dayjs";
import useAuthStore from "../../store/auth";

const { Meta } = Card;

const HistoryOfRides = () => {
  const { isLoading, startLoading, endLoading } = useAppStore((store) => store);
  const [rides, setRides] = useState<RideClient[]>([]);
  const userId = useAuthStore((store) => store.user?.id);

  const fetchHistory = async (user_id: number | string) => {
    startLoading();
    const response = ApiRideClient.getRidesFromUser(user_id);
    response
      .then((data) => {
        console.log(data);
        setRides(data);
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        endLoading();
      });
  };
  useEffect(() => {
    fetchHistory(userId);
  }, []);

  const upcomingRides = rides.filter((ride) => ride.status_id === 1);
  const сompletedRides = rides.filter((ride) => ride.status_id === 2);
  const cancelledRides = rides.filter((ride) => ride.status_id === 3);

  const ridesItems: TabsProps["items"] = [
    {
      key: "Все",
      label: `Все`,
      children: rides ? (
        rides.map((ride) => (
          <CardOfRide
            key={ride.id}
            from={"Уфа"}
            to={"Москва"}
            price={ride.price}
            passengers={ride.available_seats}
            departureTime={dayjs(ride.departure_date).format(
              "DD.MM.YYYY HH:mm",
            )}
            status={ride.status_id}
          ></CardOfRide>
        ))
      ) : (
        <Meta description="Нет записей" />
      ),
    },
    {
      key: "Ожидаемые",
      label: `Ожидаемые`,
      children: upcomingRides ? (
        upcomingRides.map((ride) => (
          <CardOfRide
            key={ride.id}
            from={"Уфа"}
            to={"Москва"}
            price={ride.price}
            passengers={ride.available_seats}
            departureTime={dayjs(ride.departure_date).format(
              "DD.MM.YYYY HH:mm",
            )}
            status={ride.status_id}
          ></CardOfRide>
        ))
      ) : (
        <Meta description="Нет записей" />
      ),
    },
    {
      key: "Завершенные",
      label: `Завершенные`,
      children: сompletedRides ? (
        сompletedRides.map((ride) => (
          <CardOfRide
            key={ride.id}
            from={"Уфа"}
            to={"Москва"}
            price={ride.price}
            passengers={ride.available_seats}
            departureTime={dayjs(ride.departure_date).format(
              "DD.MM.YYYY HH:mm",
            )}
            status={ride.status_id}
          ></CardOfRide>
        ))
      ) : (
        <Meta description="Нет записей" />
      ),
    },
    {
      key: "Отмененные",
      label: `Отмененные`,
      children: cancelledRides ? (
        cancelledRides.map((ride) => (
          <CardOfRide
            key={ride.id}
            from={"Уфа"}
            to={"Москва"}
            price={ride.price}
            passengers={ride.available_seats}
            departureTime={dayjs(ride.departure_date).format(
              "DD.MM.YYYY HH:mm",
            )}
            status={ride.status_id}
          ></CardOfRide>
        ))
      ) : (
        <Meta description="Нет записей" />
      ),
    },
  ];

  if (isLoading) {
    return <CenteredSpin></CenteredSpin>;
  }
  return (
    <>
      <Tabs items={ridesItems}></Tabs>
    </>
  );
};

export default HistoryOfRides;
