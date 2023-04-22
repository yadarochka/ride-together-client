import { Menu, Layout } from "antd";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth";
import ApiClient from "../../api/ApiAuthClient";
import { useEffect, useState } from "react";
import { Spin, message } from "antd";
import TokenService from "../../helpers/token";
import useAppStore from "../../store/app";

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const isAuth = useAuthStore((store) => store.isAuth);
  const { startLoading, endLoading } = useAppStore((store) => store);
  const login = useAuthStore((store) => store.login);
  const logout = useAuthStore((store) => store.logout);

  const updateUserData = async () => {
    const response = ApiClient.refresh();

    response
      .then((data) => {
        message.success("Все оки. Поставлен новый токен");
        login(data.userDto);
        TokenService.setToken(data.accessToken);
      })
      .catch((data) => {
        logout();
        navigate("/login");
      })
      .finally(() => endLoading());
  };

  useEffect(() => {
    if (isAuth) {
      startLoading();
      updateUserData();
    }
  }, []);

  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#2345AA",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        onClick={() => {
          navigate("/");
        }}
      >
        <img src={logo} alt="logo" style={{ height: "32px" }} />
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{
          backgroundColor: "#2345AA",
        }}
      >
        <Menu.Item
          key="create_ride"
          onClick={() => {
            navigate("/create-ride");
          }}
        >
          Создать поездку
        </Menu.Item>
        <Menu.Item
          key="rides"
          onClick={() => {
            navigate("/rides");
          }}
        >
          Найти поездку
        </Menu.Item>
        {!isAuth && (
          <>
            <Menu.Item
              key="login"
              onClick={() => {
                navigate("/login");
              }}
            >
              Войти
            </Menu.Item>
            <Menu.Item
              key="register"
              onClick={() => {
                navigate("/register");
              }}
            >
              Регистрация
            </Menu.Item>
          </>
        )}
        {isAuth && (
          <>
            <Menu.Item
              key="profile"
              onClick={() => {
                navigate("/profile");
              }}
            >
              Профиль
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
};

export default AppHeader;
