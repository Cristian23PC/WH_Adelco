interface Resource {
  id: string;
}
export interface NotificationMessage {
  type: string;
  deliveryId?: string;
  resource?: Resource;
  id?: string;
}
