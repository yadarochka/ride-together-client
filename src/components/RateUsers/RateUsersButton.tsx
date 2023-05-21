import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import RateUser from "./ModalRateUsers";
import axios from "axios";
import CenteredSpin from "../CenteredSpin/CenteredSpin";

export type Passenger = {
  id: number;
  name: string;
  surname: string;
};

interface RateUsersProps {
  passengers: Passenger[];
  rideId: number;
  userId: number;
}

function mergeUserDataWithRatingData(userArray: Passenger[], ratingArray) {
  const result = [...userArray];

  for (const user of userArray) {
    for (const rating of ratingArray) {
      if (user.id === rating.to_user_id) {
        user.value = rating.to_user_id;
        break;
      }
    }
  }

  return result;
}

const RateUsersButton: React.FC<RateUsersProps> = ({
  passengers,
  rideId,
  userId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const response = axios.get(
      `http://localhost:5000/api/rating?ride_id=${rideId}&from_user_id=${userId}`,
    );

    response
      .then((res) => {
        setUserData(mergeUserDataWithRatingData(passengers, res.data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Оценить попутчиков
      </Button>
      <Modal
        cancelText={"Закрыть"}
        title="Оцените попутчиков!"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {isLoading && <CenteredSpin />}
        {!isLoading &&
          userData
            .filter((passenger) => passenger.id !== userId)
            .map((pass) => (
              <RateUser
                rideId={rideId}
                key={pass.id}
                fromUserId={userId}
                toUser={pass}
                value={pass.value}
              ></RateUser>
            ))}
      </Modal>
    </>
  );
};

export default RateUsersButton;
