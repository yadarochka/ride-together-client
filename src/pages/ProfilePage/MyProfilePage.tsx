import { Avatar, Button, Card, Col, Divider, Row } from "antd";
import useAuthStore from "../../store/auth";
import { useNavigate } from "react-router-dom";
import { confirmedEmailIcon, unconfirmedEmailIcon } from "./components/Icons";
import TokenService from "../../helpers/token";
import HistoryOfRides from "../../components/HistoryOfRides/HistoryOfRides";
import UserRate from "../RidePage/UserRate";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((store) => store.logout);
  const user = useAuthStore((store) => store.user);

  const exitFromAccount = () => {
    TokenService.deleteToken();
    logout();
    navigate("/");
  };

  const handleClickEditProfile = () => {
    navigate("edit");
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
              <Avatar
                src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${user.id}`}
                size={64}
              >
                User
              </Avatar>
            </Col>
            <Col span={20}>
              <h2>{`${user.name} ${user.surname}`}</h2>
              <p>{`Номер телефона: ${user.phone}`}</p>
              <p>
                {`Email: ${user.email}`}{" "}
                {user.isActivated ? confirmedEmailIcon : unconfirmedEmailIcon}
              </p>
              <p>{`Пол: ${user.gender}`}</p>
              <UserRate userId={user.id} />
            </Col>
          </Row>
          <Divider />
          <Row justify="space-between">
            <Button type="primary" onClick={handleClickEditProfile}>
              Редактировать профиль
            </Button>
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
