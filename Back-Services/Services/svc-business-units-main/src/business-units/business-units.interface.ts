import { QueryParam } from '@commercetools/platform-sdk';
import { ConvertedBusinessUnit } from './models';

export type ICustomerBusinessUnits = {
  businessUnits: ConvertedBusinessUnit[];
};

export interface IAddress {
  country: string;
  region: string;
  commune: string;
  city: string;
  streetName: string;
  streetNumber?: string;
  apartment?: string;
  otherInformation?: string;
  coordinates?: {
    lat: number;
    long: number;
  };
}

export interface BusinessUnitRequest {
  name?: string;
  tradeName?: string;
  address: IAddress;
  billingAddress?: IAddress;
}

export interface GetByIdMethodArgs {
  queryArgs?: {
    [key: string]: QueryParam;
    expand?: string | string[];
  };
  headers?: {
    [key: string]: string | string[];
  };
}

export interface GetAllBusinessUnits {
  queryArgs?: {
    expand?: string | string[];
    sort?: string | string[];
    limit?: number;
    offset?: number;
    withTotal?: boolean;
    where?: string | string[];
    [key: string]: QueryParam;
  };
  headers?: {
    [key: string]: string | string[];
  };
}
