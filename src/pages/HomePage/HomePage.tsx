import React from "react";
import { Layout, Button, DatePicker, ConfigProvider } from "antd";
import AdressInput from "../../components/Input/AdressInput";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";

const { Content } = Layout;

const LandingPage = () => {
  function disabledDate(currentDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentDate && currentDate < today;
  }
  return (
    <Layout>
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
        <ConfigProvider locale={locale}>
          <DatePicker
            placeholder="Выберите дату"
            disabledDate={disabledDate}
            format={"DD.MM.YYYY"}
          />
        </ConfigProvider>
        <Button type="primary" style={{ width: "100%" }}>
          Найти поездку
        </Button>
      </Content>
    </Layout>
  );
};

export default LandingPage;
