import { object, string, boolean, type ObjectSchema } from 'yup';
import { type FormValues } from './types';

export const DEFAULT_LITERALS = {
  regionRequired: 'La región es obligatoria',
  communeRequired: 'La comuna es obligatoria',
  streetRequired: 'La calle es obligatoria',
  streetMax: 'La calle debe tener menos de 60 caracteres',
  streetNumberRequired: 'Introduzca el número de la calle',
  streetNumberMax: 'El número de calle debe tener menos de 30 caracteres',
  apartmentMaxError:
    'El número de oficina o departamento debe tener menos de 30 caracteres',
  additionalInformationMaxError:
    'La información adicional debe tener menos de 60 caracteres'
};

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<FormValues> =>
  object({
    useBusinessAddress: boolean(),
    region: string().required(literals.regionRequired),
    commune: string().required(literals.communeRequired),
    locality: string(),
    street: string()
      .required(literals.streetRequired)
      .max(60, literals.streetMax),
    noStreetNumber: boolean(),
    streetNumber: string()
      .max(30, literals.streetNumberMax)
      .when('noStreetNumber', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required(literals.streetNumberRequired)
      }),
    apartment: string().max(30, literals.apartmentMaxError),
    additionalInformation: string().max(
      60,
      literals.additionalInformationMaxError
    )
  });
