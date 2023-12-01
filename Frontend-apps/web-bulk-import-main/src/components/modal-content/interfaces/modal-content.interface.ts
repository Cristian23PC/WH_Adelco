export interface IContentModal {
  handleAction?: () => void;
  handleClose: () => void;
  title: string;
  description: string;
  actionButtonLabel?: string;
}
