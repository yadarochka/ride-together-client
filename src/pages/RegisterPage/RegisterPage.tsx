import React, { useState } from "react";
import { Form, Input, Select, Button, Card, message } from "antd";
import ApiClient from "../../api/ApiAuthClient";
import useAuthStore from "../../store/auth";
import { useNavigate } from "react-router-dom";
import TokenService from "../../helpers/token";

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

const RegistrationForm = () => {
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [phoneIsValid, setPhoneIsValid] = useState(true);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onFinish = async (values: FormValues) => {
    const response = await ApiClient.register({
      email: values.email,
      name: values.name,
      surname: values.surname,
      password: values.password,
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
    message.success("Вы успешно зарегистрированы");
    login(response.userDto);
    navigate("/");
  };

  const handleEmailChange = () => {
    setEmailIsValid(true);
  };

  const handlePhoneChange = () => {
    setPhoneIsValid(true);
  };

  return (
    <Card title="Регистрация">
      <Form
        name="registration_form"
        onFinish={onFinish}
        initialValues={{
          prefix: "+7",
        }}
        scrollToFirstError
      >
        <Form.Item
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
          validateStatus={emailIsValid ? "success" : "error"}
          help={
            emailIsValid
              ? null
              : "Пользователь с такой почтой уже зарегистрирован"
          }
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "Неправильный E-mail",
            },
            {
              required: true,
              message: "Укажите свой E-mail",
            },
          ]}
        >
          <Input onChange={handleEmailChange} />
        </Form.Item>

        <Form.Item
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
          name="password"
          label="Пароль"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите свой пароль",
            },
            {
              min: 12,
              message: "Слишком короткий пароль",
            },
            {
              max: 20,
              message: "Слишком длинный пароль",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Подтвердите пароль"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Пожалуйста, подтвердите свой пароль",
            },
            {
              min: 12,
              message: "Слишком короткий пароль",
            },
            {
              max: 20,
              message: "Слишком длинный пароль",
            },
            ({ getFieldValue }) => ({
              async validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  await Promise.resolve();
                  return;
                }
                return await Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Отправить
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RegistrationForm;
