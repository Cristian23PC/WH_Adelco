import { object, string, number, boolean, type ObjectSchema } from 'yup';
import {
  type BusinessAddressFormValues,
  type BusinessInfoFormValues,
  type FormValues
} from './types';
import { mergeSchemas } from '../../../../utils/mergeSchemas';

export const DEFAULT_LITERALS = {
  localNameRequired: 'El nombre del local es obligatorio',
  localNameMinError: 'El nombre del local debe tener al menos 3 caracteres',
  localNameMaxError: 'El nombre del local debe tener menos de 53 caracteres',
  regionRequired: 'La región es obligatoria',
  communeRequired: 'La comuna es obligatoria',
  streetRequired: 'La calle es obligatoria',
  streetMax: 'La calle debe tener menos de 60 caracteres',
  streetNumberRequired: 'Introduzca el número de la calle',
  apartmentMaxError:
    'El número de oficina o departamento debe tener menos de 30 caracteres',
  additionalInformationMaxError:
    'La información adicional debe tener menos de 60 caracteres'
};

type Literals = { [key in keyof typeof DEFAULT_LITERALS]: string };

export const businessInfoSchema = (
  literals: Literals
): ObjectSchema<BusinessInfoFormValues> =>
  object({
    RUT: string().required(),
    socialReason: string().required(),
    localName: string()
      .required(literals.localNameRequired)
      .min(3, literals.localNameMinError)
      .max(53, literals.localNameMaxError)
  });

export const businessAddressSchema = (
  literals: Literals
): ObjectSchema<BusinessAddressFormValues> =>
  object({
    region: string().required(literals.regionRequired),
    commune: string().required(literals.communeRequired),
    locality: string(),
    street: string()
      .required(literals.streetRequired)
      .max(60, literals.streetMax),
    noStreetNumber: boolean(),
    streetNumber: string().when('noStreetNumber', {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required(literals.streetNumberRequired)
    }),
    apartment: string().max(30, literals.apartmentMaxError),
    additionalInformation: string().max(
      60,
      literals.additionalInformationMaxError
    ),
    coordinates: object({
      lat: number().required(),
      long: number().required()
    }).required()
  });

export default (literals: Literals): ObjectSchema<FormValues> =>
  mergeSchemas(
    businessInfoSchema(literals),
    businessAddressSchema(literals)
  ) as ObjectSchema<FormValues>;
