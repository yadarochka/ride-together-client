import { List, Avatar, Rate } from "antd";
import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Passenger } from "./RateUsersButton";
import axios from "axios";

interface RateUserProps {
  rideId: number;
  fromUserId: number;
  toUser: Passenger;
  value: number | undefined;
}

const ModalRateUsers: FC<RateUserProps> = ({
  toUser,
  fromUserId,
  rideId,
  value,
}) => {
  const [isDisabled, setIsDisable] = useState(false);

  const handleOnChangerate = async (value: number) => {
    setIsDisable(true);

    const response = axios.post("http://localhost:5000/api/rating/", {
      ride_id: rideId,
      to_user_id: toUser.id,
      from_user_id: fromUserId,
      value,
    });
  };

  return (
    <List>
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar
              src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${toUser.id}`}
            />
          }
          title={
            <Link to={"/profile/" + toUser.id}>
              {toUser.name + " " + toUser.surname}
            </Link>
          }
          description={"ID: " + toUser.id}
        />
        <Rate
          onChange={handleOnChangerate}
          value={value}
          disabled={!!value || isDisabled}
        />
      </List.Item>
    </List>
  );
};

export default ModalRateUsers;
