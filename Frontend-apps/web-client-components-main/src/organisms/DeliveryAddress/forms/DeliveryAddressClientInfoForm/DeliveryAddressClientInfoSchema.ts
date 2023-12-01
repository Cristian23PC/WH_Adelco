import { type ObjectSchema } from 'yup';
import { type FormValues } from './types';
import {
  clientInfoSchema,
  DEFAULT_LITERALS as CLIENT_INFO_DEFAULT_LITERALS
} from '../../../registration/forms/partials/ClientInfoForm';

export const DEFAULT_LITERALS = {
  ...CLIENT_INFO_DEFAULT_LITERALS
};

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<FormValues> => clientInfoSchema(literals);
