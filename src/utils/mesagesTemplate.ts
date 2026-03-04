import { NotificationInstance } from "antd/es/notification/interface";
import { NotificationType } from "../types/types";


export const openNotificationWithIcon = (api: NotificationInstance, type: NotificationType, title: string, description: string) => {
    api[type]({
      title: title,
      description: description,
      placement: 'bottomRight'
    });
  };