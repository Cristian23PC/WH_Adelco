import { object, string, type ObjectSchema } from 'yup';
import { validate } from 'rut.js';
import { type Values } from './BusinessInfoForm';

export const DEFAULT_LITERALS = {
  invalidRut: 'RUT inválido'
};

export default (literals: {
  [key in keyof typeof DEFAULT_LITERALS]: string;
}): ObjectSchema<Values> =>
  object({
    rut: string()
      .required(literals.invalidRut)
      .test('is-rut-valid', literals.invalidRut, validate),
    razonSocial: string(),
    giro: string()
  });
