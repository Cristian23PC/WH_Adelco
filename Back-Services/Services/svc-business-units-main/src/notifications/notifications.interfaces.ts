export type NotificationType = 'MAIL_VERIFICATION_CODE' | 'PASSWORD_RECOVERY_CODE' | undefined;

export interface TemplateData {}

export interface MailVerificationCodeTemplateData extends TemplateData {
  code: number;
}

export interface NotificationMessage {
  to: { email: string; name: string }[];
  notificationType: NotificationType;
  templateData: TemplateData;
}
