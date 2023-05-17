import React, { useState } from "react";
import { Form, Input, Select, Button, Card, message } from "antd";
import ApiClient from "../../api/ApiAuthClient";
import useAuthStore from "../../store/auth";
import { useNavigate } from "react-router-dom";
import TokenService from "../../helpers/token";
import ApiUserClient from "../../api/ApiUserClient";

const { Option } = Select;

interface FormValues {
  confirm: string;
  gender: number;
  name: string;
  surname: string;
  prefix: string;
  email: string;
  password: string;
  phone: string;
}

const EditProfilePage = () => {
  const user = useAuthStore((store) => store.user);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [phoneIsValid, setPhoneIsValid] = useState(true);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const onFinish = async (values: FormValues) => {
    const response = await ApiUserClient.updateUserData({
      email: values.email,
      name: values.name,
      surname: values.surname,
      gender_id: values.gender,
      phone: values.prefix + values.phone,
    });

    if (
      response.message === "Пользователь с такой почтой уже зарегистрирован"
    ) {
      setEmailIsValid(false);
      message.error(response.message);
      return;
    }

    if (
      response.message === "Пользователь с таким номером уже зарегистрирован"
    ) {
      setPhoneIsValid(false);
      message.error(response.message);
      return;
    }

    if (response.message === "Непредвиденная ошибка") {
      message.error(response.message);
      return;
    }

    TokenService.setToken(response.accessToken);
    message.success("Данные успешно изменены");
    login(response.userDto);
    navigate("/profile");
  };

  const handlePhoneChange = () => {
    setPhoneIsValid(true);
  };

  return (
    <Card
      title="Редактирование профиля"
      style={{ maxWidth: 1000, margin: "0 auto" }}
    >
      <Form
        {...layout}
        name="registration_form"
        onFinish={onFinish}
        initialValues={{
          prefix: "+7",
        }}
        scrollToFirstError
      >
        <Form.Item
          initialValue={user?.name}
          name="name"
          label="Имя"
          rules={[
            {
              required: true,
              message: "Укажите своё имя",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          initialValue={user?.surname}
          name="surname"
          label="Фамилия"
          rules={[
            {
              required: true,
              message: "Укажите свою фамилию",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          initialValue={user?.phone.slice(2)}
          name="phone"
          label="Номер телефона"
          validateStatus={phoneIsValid ? "success" : "error"}
          help={
            phoneIsValid
              ? null
              : "Пользователь с таким номером уже зарегистрирован"
          }
          rules={[
            {
              required: true,
              message: "Укажите свой номер телефона",
            },
            {
              len: 10,
              message: "Номер телефона должен содержать ровно 10 цифр",
            },
            {
              validator: async (rule, value) => {
                if (!/^[0-9]*$/.test(value)) {
                  return await Promise.reject(
                    "Номер телефона должен содержать только цифры",
                  );
                }
                await Promise.resolve();
              },
            },
          ]}
        >
          <Input
            onChange={handlePhoneChange}
            addonBefore={
              <Form.Item
                name="prefix"
                noStyle
                rules={[{ required: true, message: "Выберете код страны" }]}
              >
                <Select
                  style={{
                    width: 70,
                  }}
                >
                  <Option value="+7">+7</Option>
                </Select>
              </Form.Item>
            }
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        <Form.Item
          initialValue={1}
          name="gender"
          label="Пол"
          rules={[
            {
              required: true,
              message: "Укажите свой пол",
            },
          ]}
        >
          <Select>
            <Option value={1}>Мужской</Option>
            <Option value={2}>Женский</Option>
            <Option value={3}>Другое</Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditProfilePage;
