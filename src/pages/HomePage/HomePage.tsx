import React from "react";
import { Layout, Button, DatePicker } from "antd";
import AdressInput from "../../components/Input/Input";
import AppHeader from "../../components/Header/Header";

const { Header, Content } = Layout;

const LandingPage = () => {
  function disabledDate(currentDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentDate && currentDate < today;
  }
  return (
    <Layout>
      <AppHeader></AppHeader>
      <Content
        style={{
          padding: "50px",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <AdressInput placeholder="Откуда ехать" />
        <AdressInput placeholder="Куда ехать" />
        <DatePicker
          placeholder="Время"
          disabledDate={disabledDate}
        ></DatePicker>
        <Button type="primary" style={{ width: "100%" }}>
          Найти поездку
        </Button>
      </Content>
    </Layout>
  );
};

export default LandingPage;
