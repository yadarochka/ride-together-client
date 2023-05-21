import { Rate, Spin } from "antd";
import axios from "axios";
import { FC, useEffect, useState } from "react";

const UserRate = (props) => {
  const [value, setValue] = useState<number>(0);
  const [count, setCount] = useState<string | number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const response = axios.get(
      "http://localhost:5000/api/rating/" + props.userId,
    );

    response
      .then((res) => {
        setValue(res.data.avg);
        setCount(res.data.count);
        setIsLoading(false);
      })
      .catch((er) => {
        setIsLoading(true);
      });
  }, []);

  if (isLoading) {
    return <Spin size="small" />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Rate disabled value={value} />
      <small style={{ textAlign: "center" }}>Количество оценок: {count}</small>
    </div>
  );
};

export default UserRate;
