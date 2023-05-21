import { Avatar, Button, Card, Col, Divider, Row } from "antd";
import useAuthStore from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { confirmedEmailIcon, unconfirmedEmailIcon } from "./components/Icons";
import TokenService from "../../helpers/token";
import HistoryOfRides from "../../components/HistoryOfRides/HistoryOfRides";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((store) => store.logout);
  const user = useAuthStore((store) => store.user);

  const exitFromAccount = () => {
    TokenService.deleteToken();
    logout();
    navigate("/");
  };

  if (user) {
    return (
      <>
        <Card
          title="Профиль пользователя"
          style={{ maxWidth: 600, margin: "0 auto", marginBottom: "25px" }}
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
          <Row justify="space-between">
            <Button type="primary">Редактировать профиль</Button>
            <Button danger type="primary" onClick={exitFromAccount}>
              Выйти
            </Button>
          </Row>
        </Card>
        <Card
          title="История поездок"
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          <HistoryOfRides />
        </Card>
      </>
    );
  }

  return null;
};

export default MyProfilePage;
