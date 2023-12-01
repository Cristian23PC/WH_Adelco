/* eslint-disable @typescript-eslint/indent */
import { type Coordinates } from '../../../../utils/types';

export interface BusinessInfoFormValues {
  RUT: string;
  socialReason: string;
  localName: string;
}

export interface BusinessAddressFormValues {
  region: string;
  commune: string;
  locality?: string;
  street: string;
  streetNumber?: string;
  noStreetNumber?: boolean;
  apartment?: string;
  additionalInformation?: string;
  coordinates: Coordinates;
}

export interface FormValues
  extends BusinessInfoFormValues,
    BusinessAddressFormValues {}
