import { type ObjectSchema } from 'yup';
import { type FormValues } from './types';
import {
  businessAddressSchema,
  businessInfoSchema,
  DEFAULT_LITERALS as REGISTRATION_BUSINESS_INFO_DEFAULT_LITERALS
} from '../../../registration/forms/BusinessInformationForm/BusinessInformationSchema';
import { mergeSchemas } from '../../../../utils/mergeSchemas';

export const DEFAULT_LITERALS = {
  ...REGISTRATION_BUSINESS_INFO_DEFAULT_LITERALS
};

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<FormValues> =>
  mergeSchemas(
    businessInfoSchema(literals).pick(['localName']),
    businessAddressSchema(literals)
  ) as ObjectSchema<FormValues>;
