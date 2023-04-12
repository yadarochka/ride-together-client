import React from "react";
import { Menu, Layout } from "antd";
import logo from "../../assets/logo.svg";

const { Header } = Layout;

const AppHeader = () => {
  return (
    <Header
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#2345AA",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="logo" style={{ height: "32px" }} />
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        style={{
          backgroundColor: "#2345AA",
        }}
      >
        <Menu.Item key="1">Создать поездку</Menu.Item>
        <Menu.Item key="2">Войти</Menu.Item>
        <Menu.Item key="3">Регистрация</Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;
