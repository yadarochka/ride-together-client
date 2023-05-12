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
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/ru";
import locale from "antd/locale/ru_RU";
import { useEffect, useState } from "react";
import useRideStore from "../../store/rides";
import ApiRideClient from "../../api/ApiRideClient";
import { type RideClient } from "../../api/type";
import { red, green } from "@ant-design/colors";
import { Link, useNavigate } from "react-router-dom";
import AdressInput from "../../components/Input/AdressInput";
import useAuthStore from "../../store/auth";
import useLocationStore from "../../store/location";

const { Search } = Input;
const { Column } = Table;

const ListOfRides = () => {
  const [isShowButtonAllRides, setIsShowButtonAllRides] = useState(true);
  const [form] = Form.useForm();
  const [date, setDate] = useState(dayjs());
  const [tableIsLoading, setTableIsLoading] = useState<boolean>(false);
  const [sortDirection, setsortDirection] = useState<
    "ascend" | "descend" | undefined
  >(undefined);

  const {
    arrivalLocationCoor,
    departureLocationCoor,
    setArrivalLocationCoor,
    setDepartureLocationCoor,
    setArrivalLocationName,
    setDepartureLocationName,
  } = useLocationStore((store) => store);

  const setRides = useRideStore((store) => store.setRides);
  const rides = useRideStore((store) => store.rides);

  const navigate = useNavigate();

  function disabledDate(currentDate: Date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentDate && currentDate < today;
  }

  const dateOnChange = (date: Dayjs | null, dateString: string) => {
    setDate(date);
  };

  const handleSort = (pagination, filters, sorter, extra) => {
    const { field, order } = sorter;
    setsortDirection(order);
  };

  const fetchAllRides = async () => {
    setTableIsLoading(true);
    setIsShowButtonAllRides(false);
    const response = ApiRideClient.getRides();

    response
      .then((data) => {
        setRides(data);
        message.success("Запрос успешно выполнен");
      })
      .catch(console.error)
      .finally(() => {
        setTableIsLoading(false);
      });
  };

  const onFinish = (values: { price: number[]; seats: number[] }) => {
    console.log(date);
    setTableIsLoading(true);
    setIsShowButtonAllRides(true);
    const response = ApiRideClient.getRidesWithFilters({
      minPrice: values.price[0],
      maxPrice: values.price[1],
      minSeats: values.seats[0],
      maxSeats: values.seats[1],
      departure_location: departureLocationCoor,
      arrival_location: arrivalLocationCoor,
      minRadius: values.radius[0],
      maxRadius: values.radius[1],
      date: date.$d,
    });

    response
      .then((data) => {
        setRides(data);
        message.success("Запрос успешно выполнен");
      })
      .catch(console.error)
      .finally(() => {
        setTableIsLoading(false);
      });
  };

  useEffect(() => {
    setTableIsLoading(true);
    const response = ApiRideClient.getRidesWithFilters({
      minPrice: 0,
      maxPrice: 2000,
      minSeats: 1,
      maxSeats: 4,
    });
    response
      .then((rides) => {
        setRides(rides);
      })
      .catch((err) => message.error(err.message))
      .finally(() => {
        setTableIsLoading(false);
      });
  }, []);

  return (
    <Card title="Поиск поездки">
      <Form
        form={form}
        name="search-form"
        onFinish={onFinish}
        layout="inline"
        style={{ marginBottom: "20px" }}
      >
        <Form.Item name="from" label="">
          <AdressInput
            placeholder={"Откуда"}
            style={{ width: "250px" }}
            onSelect={setDepartureLocationCoor}
            setName={setDepartureLocationName}
          />
        </Form.Item>

        <Form.Item name="to" label="">
          <AdressInput
            placeholder={"Куда"}
            style={{ width: "250px" }}
            onSelect={setArrivalLocationCoor}
            setName={setArrivalLocationName}
          />
        </Form.Item>

        <Form.Item
          name="radius"
          label="Радиус поиска (км)"
          initialValue={[0, 500]}
          style={{ width: "250px" }}
        >
          <Slider
            min={0}
            max={500}
            range
            step={10}
            defaultValue={[0, 500]}
            tooltip={{ open: true }}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={500}
            aria-valuenow={[0, 500]}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Цена"
          style={{ width: "250px" }}
          initialValue={[0, 2000]}
        >
          <Slider
            range
            step={10}
            min={0}
            max={2500}
            defaultValue={[0, 1000]}
            tooltip={{ open: true }}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={2500}
            aria-valuenow={[0, 1000]}
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
            role="slider"
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={[1, 4]}
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

        {isShowButtonAllRides && (
          <Form.Item>
            <Button type="link" onClick={fetchAllRides}>
              Показать все
            </Button>
          </Form.Item>
        )}
      </Form>

      <Table
        loading={tableIsLoading}
        dataSource={rides}
        onChange={handleSort}
        style={{ height: "75vh" }}
      >
        <Column
          title="Водитель"
          key="driver"
          render={(text, record: RideClient) => (
            <Link to={"/profile/" + record.driver_id}>
              {record.driver_name}
            </Link>
          )}
        />
        <Column title="Откуда" dataIndex="departure_location_name" key="from" />
        <Column title="Куда" dataIndex="arrival_location_name" key="to" />
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
          title="Подробнее"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <Button
                type="primary"
                onClick={() => {
                  navigate("/ride/" + record.id);
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
