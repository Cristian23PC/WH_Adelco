export interface IPrices {
  distributionChannel: string;
}

export interface IChannels {
  value: string;
  label: string;
}

export enum EStatusModal {
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface IError {
  response: { status: number };
}
