import React from "react";
import { useNotification } from "../NotificationContext";

const Notification = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    backgroundColor:
      notification.type === "error" ? "lightcoral" : "lightgreen",
  };

  return <div style={style}>{notification.message}</div>;
};

export default Notification;
