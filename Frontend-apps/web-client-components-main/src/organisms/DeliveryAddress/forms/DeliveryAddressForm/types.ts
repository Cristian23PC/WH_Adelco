/* eslint-disable @typescript-eslint/indent */
import {
  type BusinessAddressFormValues,
  type BusinessInfoFormValues
} from '../../../registration/forms/BusinessInformationForm/types';

export interface FormValues
  extends Pick<BusinessInfoFormValues, 'localName'>,
    BusinessAddressFormValues {}
