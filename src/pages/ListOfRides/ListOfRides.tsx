import {
  Input,
  Button,
  Table,
  Form,
  Space,
  Card,
  Slider,
  ConfigProvider,
  DatePicker,
  Progress,
  Tooltip,
  message,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
import { useEffect, useState } from "react";
import useRideStore from "../../store/rides";
import useAppStore from "../../store/app";
import ApiRideClient from "../../api/ApiRideClient";
import { RideClient } from "../../api/type";
import { red, green } from "@ant-design/colors";
import { Link } from "react-router-dom";
import queryString from "query-string";
import AdressInput from "../../components/Input/AdressInput";
import useAuthStore from "../../store/auth";

const { Search } = Input;
const { Column } = Table;

const ListOfRides = () => {
  const [form] = Form.useForm();
  const [date, setDate] = useState(dayjs());
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [sortDirection, setsortDirection] = useState<
    "ascend" | "descend" | undefined
  >(undefined);

  const setRides = useRideStore((store) => store.setRides);
  const rides = useRideStore((store) => store.rides);

  const userId = useAuthStore((store) => store.user?.id);

  function disabledDate(currentDate: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentDate && currentDate < today;
  }

  const dateOnChange = (date: Dayjs | null, dateString: string) => {
    if (date) {
      setDate(date);
    }
  };

  const handleSort = (pagination, filters, sorter, extra) => {
    const { field, order } = sorter;
    setsortDirection(order);
  };

  const onFinish = (values: { price: number[]; seats: number[] }) => {
    setTableIsLoading(true);

    const response = ApiRideClient.getRidesWithFilters({
      minPrice: values.price[0],
      maxPrice: values.price[1],
      minSeats: values.seats[0],
      maxSeats: values.seats[1],
    });

    response
      .then((data) => {
        setRides(data);
        message.success("Запрос успешно выполнен");
        console.log(data);
      })
      .catch(console.error)
      .finally(() => setTableIsLoading(false));
  };

  useEffect(() => {
    setTableIsLoading(true);
    const response = ApiRideClient.getRides();
    response
      .then((rides) => {
        message.success("Аксес токен норм");
        setRides(rides);
      })
      .catch((err) => message.error(err.message))
      .finally(() => setTableIsLoading(false));
  }, []);

  // useEffect(() => {
  //   const params = queryString.parse(location.search);
  //   // Устанавливаем значения слайдеров из параметров поиска
  //   setPriceRange([
  //     Number(params.minPrice || 0),
  //     Number(params.maxPrice || 1000),
  //   ]);
  //   setSeats(Number(params.seats || 1));
  // }, [location.search]);

  // useEffect(() => {
  //   // Сериализуем значения слайдеров в строку запроса и обновляем историю браузера
  //   const newSearch = queryString.stringify({
  //     minPrice: priceRange[0],
  //     maxPrice: priceRange[1],
  //     seats,
  //   });
  //   history.push({ search: newSearch });
  // }, [priceRange, seats, history]);

  return (
    <Card title="Поиск поездки">
      <Form form={form} name="search-form" onFinish={onFinish} layout="inline">
        <Form.Item name="from" label="">
          {/* <Input placeholder="Откуда" /> */}
          <AdressInput placeholder={"Откуда"} style={{ width: "250px" }} />
        </Form.Item>

        <Form.Item name="to" label="">
          <AdressInput placeholder={"Откуда"} style={{ width: "250px" }} />
          {/* <Input placeholder="Куда" /> */}
        </Form.Item>

        <Form.Item
          name="price"
          label="Цена"
          style={{ width: "250px" }}
          initialValue={[0, 1000]}
        >
          <Slider
            range
            step={10}
            max={2500}
            defaultValue={[0, 1000]}
            tooltip={{ open: true }}
          />
        </Form.Item>

        <Form.Item
          name="seats"
          label="Свободных мест"
          initialValue={[1, 4]}
          style={{ width: "250px" }}
        >
          <Slider
            min={1}
            max={4}
            range
            step={1}
            defaultValue={[1, 4]}
            tooltip={{ open: true }}
          />
        </Form.Item>

        <Form.Item
          label="Дата отправления"
          name="departure_date"
          initialValue={dayjs()}
        >
          <ConfigProvider locale={locale}>
            <DatePicker
              placeholder="Выберите дату"
              disabledDate={disabledDate}
              format={"DD.MM.YYYY"}
              onChange={dateOnChange}
              value={date}
            />
          </ConfigProvider>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Найти
          </Button>
        </Form.Item>
      </Form>

      <Table loading={tableIsLoading} dataSource={rides} onChange={handleSort}>
        <Column
          title="Водитель"
          key="driver"
          render={(text, record: RideClient) => (
            <Link to={"/profile/" + record.driver_id}>
              {record.driver_name}
            </Link>
          )}
        />
        <Column title="Откуда" dataIndex="departure_location" key="from" />
        <Column title="Куда" dataIndex="arrival_location" key="to" />
        <Column
          title="Цена"
          dataIndex="price"
          key="price"
          sorter={(a, b) => a.price - b.price}
          showSorterTooltip={{
            title:
              sortDirection === "ascend"
                ? "Сортировать поездки по убыванию цены"
                : sortDirection === "descend"
                ? "Сбросить сортировку"
                : "Сортировать поездки по возрастанию цены",
          }}
        />
        <Column
          title="Свободно/Всего мест"
          sorter={(a: RideClient, b: RideClient) =>
            a.available_seats - b.available_seats
          }
          showSorterTooltip={{
            title:
              sortDirection === "ascend"
                ? "Сортировать поездки по убыванию доступных мест"
                : sortDirection === "descend"
                ? "Сбросить сортировку"
                : "Сортировать поездки по возрастанию доступных мест",
          }}
          render={(text, record: RideClient) => (
            <Tooltip
              title={`Доступно ${record.available_seats} мест из ${record.total_seats}`}
            >
              <Progress
                showInfo={false}
                percent={(record.available_seats / record.total_seats) * 100}
                steps={record.total_seats}
                strokeColor={Array.from(
                  { length: record.total_seats },
                  (_, i) => {
                    if (i < record.available_seats) {
                      return green[6];
                    }
                    return red[6];
                  },
                )}
              />
            </Tooltip>
          )}
          key="seats"
        />
        <Column
          title="Дата отправления"
          showSorterTooltip={{
            title:
              sortDirection === "ascend"
                ? "Показать сначала дальнейшие"
                : sortDirection === "descend"
                ? "Сбросить сортировку"
                : "Показать сначала ближайшие",
          }}
          sorter={(a: RideClient, b: RideClient) =>
            dayjs(a.departure_date).unix() - dayjs(b.departure_date).unix()
          }
          render={(text, record: RideClient) => (
            <>
              {dayjs(record.departure_date.toString()).format(
                "DD.MM.YYYY HH:mm",
              )}
            </>
          )}
          key="time"
        />
        <Column
          title="Бронирование"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button
                type="primary"
                onClick={async () => {
                  const response = await ApiRideClient.joinToToRide(
                    record.id,
                    userId,
                  );

                  message.success(response);
                }}
              >
                Подробнее
              </Button>
            </Space>
          )}
        />
      </Table>
    </Card>
  );
};

export default ListOfRides;
