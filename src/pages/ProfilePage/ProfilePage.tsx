import { Avatar, Card, Col, Divider, Row, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { confirmedEmailIcon, unconfirmedEmailIcon } from "./components/Icons";
import { UserDto } from "../../api/type";
import { useEffect, useState } from "react";
import ApiUserClient from "../../api/ApiUserClient";
import useAppStore from "../../store/app";
import useAuthStore from "../../store/auth";

const ProfilePage = () => {
  const { isLoading, startLoading, endLoading } = useAppStore((store) => store);
  const authUserId = useAuthStore((store) => store.user?.id);
  const { userId } = useParams();
  const [user, setUser] = useState<UserDto>();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId == authUserId) {
      navigate("/profile");
    }
  }, [userId, authUserId]);

  useEffect(() => {
    if (userId) {
      const response = ApiUserClient.getUserProfile(userId);
      startLoading();

      response.then((data) => setUser(data)).finally(() => endLoading());
    }
  }, []);

  if (isLoading || !user) {
    return <Spin></Spin>;
  }

  if (user) {
    return (
      <Card
        title="Профиль пользователя"
        style={{ maxWidth: 600, margin: "0 auto" }}
      >
        <Row justify="space-between" align="middle">
          <Col span={4}>
            <Avatar size={64}>User</Avatar>
          </Col>
          <Col span={20}>
            <h2>{`${user.name} ${user.surname}`}</h2>
            <p>{`Номер телефона: ${user.phone}`}</p>
            <p>
              {`Email: ${user.email}`}{" "}
              {user.isActivated ? confirmedEmailIcon : unconfirmedEmailIcon}
            </p>
            <p>{`Пол: ${user.gender}`}</p>
          </Col>
        </Row>
        <Divider />
        <Row justify="space-between"></Row>
      </Card>
    );
  }

  return null;
};

export default ProfilePage;
