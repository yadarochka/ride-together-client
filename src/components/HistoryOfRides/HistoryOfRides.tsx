import { useEffect, useState } from "react";
import { Card, Tabs, type TabsProps, message } from "antd";
import ApiRideClient from "../../api/ApiRideClient";
import useAppStore from "../../store/app";
import CenteredSpin from "../CenteredSpin/CenteredSpin";
import CardOfRide from "./CardOfRide";
import { type RideClient } from "../../api/type";
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
      children:
        rides.length > 0 ? (
          rides.map((ride) => (
            <CardOfRide
              ride_id={ride.id}
              key={ride.id}
              from={ride.departure_location_name}
              to={ride.arrival_location_name}
              price={ride.price}
              available_seats={ride.available_seats}
              total_seats={ride.total_seats}
              departureTime={dayjs(ride.departure_date).format(
                "DD.MM.YYYY HH:mm",
              )}
              status={ride.status}
            ></CardOfRide>
          ))
        ) : (
          <Meta description="Нет записей" />
        ),
    },
    {
      key: "Планируются",
      label: `Планируются`,
      children:
        upcomingRides.length > 0 ? (
          upcomingRides.map((ride) => (
            <CardOfRide
              ride_id={ride.id}
              key={ride.id}
              from={ride.departure_location_name}
              to={ride.arrival_location_name}
              price={ride.price}
              available_seats={ride.available_seats}
              total_seats={ride.total_seats}
              departureTime={dayjs(ride.departure_date).format(
                "DD.MM.YYYY HH:mm",
              )}
              status={ride.status}
            ></CardOfRide>
          ))
        ) : (
          <Meta description="Нет записей" />
        ),
    },
    {
      key: "Завершенные",
      label: `Завершенные`,
      children:
        сompletedRides.length > 0 ? (
          сompletedRides.map((ride) => (
            <CardOfRide
              ride_id={ride.id}
              key={ride.id}
              from={ride.departure_location_name}
              to={ride.arrival_location_name}
              price={ride.price}
              available_seats={ride.available_seats}
              total_seats={ride.total_seats}
              departureTime={dayjs(ride.departure_date).format(
                "DD.MM.YYYY HH:mm",
              )}
              status={ride.status}
            ></CardOfRide>
          ))
        ) : (
          <Meta description="Нет записей" />
        ),
    },
    {
      key: "Отмененные",
      label: `Отмененные`,
      children:
        cancelledRides.length > 0 ? (
          cancelledRides.map((ride) => (
            <CardOfRide
              ride_id={ride.id}
              key={ride.id}
              from={ride.departure_location_name}
              to={ride.arrival_location_name}
              price={ride.price}
              available_seats={ride.available_seats}
              total_seats={ride.total_seats}
              departureTime={dayjs(ride.departure_date).format(
                "DD.MM.YYYY HH:mm",
              )}
              status={ride.status}
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
