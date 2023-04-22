import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Card,
  ConfigProvider,
  Spin,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
import useAppStore from "../../store/app";
import { RideClient } from "../../api/type";
import ApiRideClient from "../../api/ApiRideClient";
import TokenService from "../../helpers/token";

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const CreateRidePage = () => {
  const isLoading = useAppStore((state) => state.isLoading);
  const [date, setDate] = useState<Dayjs>();

  function disabledDate(currentDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentDate && currentDate < today;
  }

  const onFinish = (values: RideClient) => {
    console.log(TokenService.getToken());
    values.departure_date = date.$d;
    values.departure_location = [50, 50];
    values.arrival_location = [60, 60];
    console.log(values);
    ApiRideClient.createRide(values)
      .then((data) => message.success("Поездка успешно создана"))
      .catch((er) => message.error(er.message));
  };

  const dateOnChange = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setDate(date);
    }
  };

  if (isLoading) {
    return <Spin></Spin>;
  }

  return (
    <Card title="Создание поездки" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Form {...layout} onFinish={onFinish}>
        <Form.Item
          label="Откуда"
          name="departure_location"
          rules={[
            {
              required: true,
              message: "Пожалуйста, укажите место отправления",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Куда"
          name="arrival_location"
          rules={[
            { required: true, message: "Пожалуйста, укажите место назначения" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Дата отправления" name="departure_date">
          <ConfigProvider locale={locale}>
            <DatePicker
              showTime
              placeholder="Выберите дату"
              disabledDate={disabledDate}
              format={"DD.MM.YYYY HH:mm"}
              onChange={dateOnChange}
              value={date}
            />
          </ConfigProvider>
        </Form.Item>

        <Form.Item
          label="Количество мест"
          name="available_seats"
          initialValue={1}
          rules={[
            {
              required: true,
              message: "Пожалуйста, укажите количество доступных мест",
            },
          ]}
        >
          <InputNumber min={1} max={4} />
        </Form.Item>

        <Form.Item
          initialValue={0}
          label="Цена"
          name="price"
          rules={[
            { required: true, message: "Пожалуйста, укажите цену поездки" },
          ]}
        >
          <InputNumber min={0} step={10} />
        </Form.Item>

        <Form.Item label="Детали поездки" name="details">
          <Input.TextArea />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Создать поездку
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateRidePage;
