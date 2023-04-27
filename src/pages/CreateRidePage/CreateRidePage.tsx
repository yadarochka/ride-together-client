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
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
import useAppStore from "../../store/app";
import { type RideClient } from "../../api/type";
import ApiRideClient from "../../api/ApiRideClient";
import TokenService from "../../helpers/token";
import { useNavigate } from "react-router-dom";
import AdressInput from "../../components/Input/AdressInput";
import useLocationStore from "../../store/location";
import { red, green } from "@ant-design/colors";

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
  const navigate = useNavigate();

  const {
    arrivalLocationCoor,
    departureLocationCoor,
    arrivalLocationName,
    departureLocationName,
    setArrivalLocationCoor,
    setDepartureLocationCoor,
    setDepartureLocationName,
    setArrivalLocationName,
  } = useLocationStore((store) => store);

  function disabledDate(currentDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentDate && currentDate < today;
  }

  const onFinish = (values: RideClient) => {
    if (!departureLocationCoor || !arrivalLocationCoor) {
      message.error("Вы не указали адреса!");
      return;
    }
    values.departure_location_name = departureLocationName;
    values.arrival_location_name = arrivalLocationName;
    values.departure_date = date.$d;
    values.departure_location = departureLocationCoor;
    values.arrival_location = arrivalLocationCoor;
    ApiRideClient.createRide(values)
      .then((data) => {
        message.success("Поездка успешно создана");
        navigate("/");
      })
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
        <Form.Item label="Откуда" name="departure_location">
          <AdressInput
            placeholder={"Место отправления"}
            onSelect={setDepartureLocationCoor}
            setName={setDepartureLocationName}
          />
        </Form.Item>

        <Form.Item label="Куда" name="arrival_location">
          <AdressInput
            placeholder={"Место назначения"}
            onSelect={setArrivalLocationCoor}
            setName={setArrivalLocationName}
          />
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

        <Form.Item label="Детали поездки" name="additional_details">
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
