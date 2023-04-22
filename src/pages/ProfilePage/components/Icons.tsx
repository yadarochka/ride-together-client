import { Tooltip } from "antd";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";

export const confirmedEmailIcon = (
  <Tooltip title="Почта подтверждена">
    <CheckCircleTwoTone twoToneColor="#52c41a" />
  </Tooltip>
);

export const unconfirmedEmailIcon = (
  <Tooltip title="Почта не подтверждена">
    <ExclamationCircleTwoTone twoToneColor="#eb2f96" />
  </Tooltip>
);
