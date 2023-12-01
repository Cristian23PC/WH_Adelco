export type NotificationType = 'ORDER_CONTACT_REQUEST' | undefined;

export interface TemplateData {}
export interface NotificationMessage {
  to: { email: string; name: string }[];
  notificationType: NotificationType;
  templateData: TemplateData;
}
