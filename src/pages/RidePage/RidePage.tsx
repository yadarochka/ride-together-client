import React, { type ReactElement, useEffect, useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  List,
  Popconfirm,
  Progress,
  Tooltip,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import ApiRideClient from "../../api/ApiRideClient";
import { Link, useParams } from "react-router-dom";
import useAppStore from "../../store/app";
import CenteredSpin from "../../components/CenteredSpin/CenteredSpin";
import { red, green } from "@ant-design/colors";
import useAuthStore from "../../store/auth";

const RideMap = React.lazy(() => import("../../components/Map/Map"));

const RidePage = () => {
  const [isHost, setIsHost] = useState(false);
  const [inRide, setInRide] = useState();
  const [ride, setRide] = useState();
  const [passengers, setPassengers] = useState();
  const user = useAuthStore((store) => store.user);
  const { isLoading, endLoading, startLoading } = useAppStore((store) => store);

  const { ride_id } = useParams();
  console.log("user", user);
  useEffect(() => {
    ApiRideClient.inRide(ride_id, user.id).then();
  }, [inRide]);

  const [isAffixed, setIsAffixed] = useState(false);

  useEffect(() => {
    if (ride) {
      if (ride.driver_id === user?.id) {
        setIsHost(true);
      }
    }
  }, [ride]);
  useEffect(() => {
    if (ride_id) {
      startLoading();
      const ride = ApiRideClient.getRideById(ride_id);
      const passengers = ApiRideClient.getPassengers(ride_id);
      const inRidePromise = ApiRideClient.inRide(ride_id, user.id);

      passengers.then((data) => {
        setPassengers(data);
      });

      ride.then((data) => {
        setRide(data);
      });

      inRidePromise.then((data) => {
        setInRide(data.exists);
      });

      Promise.all([ride, passengers, inRidePromise]).finally(() => {
        endLoading();
      });
    }
  }, [ride_id]);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      setIsAffixed(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const leaveTheRide = async () => {
    const response = ApiRideClient.leaveFromRide(ride_id, user.id);

    response
      .then(() => {
        setInRide(false);
        setPassengers(passengers.filter((pass) => pass.id !== user.id));
        setRide({ ...ride, available_seats: ride.available_seats + 1 });
        message.success("Вы покинули поездку!");
      })
      .catch(() => message.error(err));
  };

  const joinToRide = async () => {
    const response = ApiRideClient.joinToToRide(ride_id, user.id);

    response
      .then(() => {
        setInRide(true);
        setPassengers([
          ...passengers,
          {
            id: user?.id,
            name: user?.name,
            surname: user?.surname,
          },
        ]);
        setRide({ ...ride, available_seats: ride.available_seats - 1 });
        message.success("Вы присоединились к поездке!");
      })
      .catch((err) => message.error(err));
  };

  const cancelRide = () => {
    ApiRideClient.cancelRide(ride_id)
      .then(() => message.success("Поездка отменена!"))
      .catch(() => message.error("Произошла ошибка!"));
  };

  if (isLoading) {
    return <CenteredSpin />;
  }

  if (ride && passengers) {
    return (
      <>
        <Card title="Поездка" style={{ marginBottom: "15px" }}>
          <Descriptions>
            <Descriptions.Item label="ID поездки">{ride.id}</Descriptions.Item>
            <Descriptions.Item label="Откуда">
              {ride.departure_location_name}
            </Descriptions.Item>
            <Descriptions.Item label="Куда">
              {ride.arrival_location_name}
            </Descriptions.Item>
            <Descriptions.Item label="Дата отправления">
              {dayjs(ride.departure_date).format("DD.MM.YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Цена">{ride.price} ₽</Descriptions.Item>
            <Descriptions.Item label="Детали поездки">
              {ride.additional_details ? ride.additional_details : "Нет"}
            </Descriptions.Item>
            <Descriptions.Item label={"Статус поездки"}>
              {ride.status}
            </Descriptions.Item>
            <Descriptions.Item label={"Доступные места"}>
              <Tooltip
                title={`Доступно ${ride.available_seats} мест из ${ride.total_seats}`}
              >
                <Progress
                  showInfo={false}
                  percent={(ride.available_seats / ride.total_seats) * 100}
                  steps={ride.total_seats}
                  strokeColor={Array.from(
                    { length: ride.total_seats },
                    (_, i) => {
                      if (i < ride.available_seats) {
                        return green[6];
                      }
                      return red[6];
                    },
                  )}
                />
              </Tooltip>
            </Descriptions.Item>
          </Descriptions>
          {isHost && (
            <Popconfirm
              cancelButtonProps={{ title: "Отмена" }}
              cancelText="Отмена"
              title="Отмена поездки"
              description="Вы уверены, что хотите отменить поездку? Отменить данное действие нельзя"
              icon={<QuestionCircleOutlined style={{ color: "red" }} />}
              onConfirm={cancelRide}
            >
              <Button type="primary" danger>
                Отменить поездку
              </Button>
            </Popconfirm>
          )}
          {inRide && (
            <Button danger type="primary" onClick={leaveTheRide}>
              Покинуть поездку
            </Button>
          )}
          {!inRide && !isHost && (
            <Button
              disabled={ride.available_seats === 0}
              type="primary"
              onClick={joinToRide}
            >
              Присоединиться к поездке!
            </Button>
          )}
        </Card>
        <Card
          title={"Информация о попутчиках"}
          style={{ marginBottom: "15px" }}
        >
          <List header={<Typography.Text strong>Водитель</Typography.Text>}>
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${0}`}
                  />
                }
                title={
                  <Link to={"/profile/" + ride.driver_id}>
                    {ride.driver_name + " " + ride.driver_surname}
                  </Link>
                }
                description={"ID: " + ride.driver_id}
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
                  title={
                    <Link to={"/profile/" + item.id}>
                      {item.name + " " + item.surname}{" "}
                      {item.id === user.id && "(Это вы)"}
                    </Link>
                  }
                  description={"ID: " + item.id}
                />
              </List.Item>
            )}
          />
        </Card>
        <Card title={"Маршрут"}>
          <React.Suspense fallback={<CenteredSpin />}>
            <RideMap
              pointA={ride.departure_location}
              pointB={ride.arrival_location}
            />
          </React.Suspense>
        </Card>
        {!inRide && !isHost && (
          <Button
            onClick={joinToRide}
            type="primary"
            style={{
              position: "fixed",
              bottom: 40,
              right: 40,
              opacity: isAffixed && ride.available_seats !== 0 ? 1 : 0,
            }}
          >
            Присоединиться к поездке!
          </Button>
        )}
      </>
    );
  }
};

export default RidePage;
