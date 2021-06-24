import { notification } from "antd";
import { NotificationPlacement } from "antd/lib/notification";

export const handleError = (error: Error) => {
  notify("error", "An error occurred: ", error.message);
  console.error(error);
};

export const notify = (
  type: "success" | "error" | "info" | "warning",
  message: string,
  description: string,
  placement: NotificationPlacement = "topRight"
) => {
  notification[type]({ message, description, placement });
};
